const express = require("express")
const router = express.Router();
const db = require("../models");
const dialogflow = require("@google-cloud/dialogflow").v2;
const path = require('path')
const sound = require("sound-play")
const now = new Date()
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const options = {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true}

router.post('/api/input', (request, response) => {
  const projectId = 'meets-dnx9';
  const sessionId = '123456';
  const queries = [request.body.input]
  const languageCode = 'en';
  const sessionClient = new dialogflow.SessionsClient(); // Instantiates a session client
  const fs = require('fs'); // for writing audio output
  const util = require('util');

  async function detectIntent(projectId, sessionId, query, contexts, languageCode, first) {
    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
    };

    if (!first) {
      request.outputAudioConfig = { audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16', }
    }

    if (contexts && contexts.length > 0) {
      request.queryParams = { contexts: contexts, }
    }

    const responses = await sessionClient.detectIntent(request)
    
    if (!first) {
      responses[0].queryResult.intent.displayName = "Echo"
    }

    return responses[0];
  }

  // Find user's friend in the request and get their events
  async function getPast(friend, reply) {
    // grab one from past/future/now depending on time
    db.User.findOne({
      where: {
        [Op.or]: [
          { username: friend },
          { first_name: friend }
        ]
      },
      include: [
        {
          model: db.Event,
          where: {
            dateTime: {
              [Op.lt]: now
            }
          }
        }
      ],
      order: [['Events', 'dateTime', 'ASC']]
    }).then(async (dbUser) => {
      let echo
      dbUser === null ? echo = `${reply} nothing planned.` :
        echo = `${reply} ${dbUser.Events[0].dataValues.name} on ${dbUser.Events[0].dataValues.dateTime.toLocaleString('en-US', options)}`
      executeQueries(projectId, sessionId, [`Echoing ${echo} EndOutput`], languageCode, false);
    })
  }

  async function getPresent(friend, reply) {
    // grab one from past/future/now depending on time
    db.User.findOne({
      where: {
        [Op.or]: [
          { username: friend },
          { first_name: friend }
        ]
      },
      include: [
        {
          model: db.Event,
          where: {
            dateTime: {
              [Op.between]: [now.setHours(now.getHours() - 1), now.setHours(now.getHours() + 1)]
            }
          }
        }
      ]
    }).then(async (dbUser) => {
      let echo
      dbUser === null ? echo = `${reply} seems to be available. ${reply} has nothing planned on their schedule for the past hour.` :
        echo = `${reply} is currently unavailable. ${reply} has ${dbUser.Events[0].dataValues.name} planned for ${dbUser.Events[0].dataValues.dateTime.toLocaleString('en-US', options)}`
      executeQueries(projectId, sessionId, [`Echoing ${echo} EndOutput`], languageCode, false);
    })
  }

  async function getFuture(friend, reply) {
    // grab one from past/future/now depending on time
    db.User.findOne({
      where: {
        [Op.or]: [
          { username: friend },
          { first_name: friend }
        ]
      },
      include: [
        {
          model: db.Event,
          where: {
            dateTime: {
              [Op.gt]: now
            }
          }
        }
      ],
      order: [['Events', 'dateTime', 'ASC']]
    }).then(async (dbUser) => {
      let echo
      dbUser === null ? echo = `${reply} no future events at this moment.` :
        echo = `${reply} an event named ${dbUser.Events[0].dataValues.name} planned for ${dbUser.Events[0].dataValues.dateTime.toLocaleString('en-US', options)}`
      executeQueries(projectId, sessionId, [`Echoing ${echo} EndOutput`], languageCode, false);
    })
  }

  async function executeQueries(projectId, sessionId, queries, languageCode, first) {
    const writePromise = util.promisify(fs.writeFile)
    // Keeping the context across queries let's us simulate an ongoing conversation with the bot
    let context, aiRes, echo, name, result, intent, aiName = 'Meets A.I'
    for (const query of queries) {
      try {

        aiRes = await detectIntent(projectId, sessionId, query, context, languageCode, first);
        context = aiRes.queryResult.outputContexts
        intent = aiRes.queryResult.intent.displayName
        result = aiRes.queryResult.fulfillmentText

        console.log(intent)

        switch (intent) {
          case "Echo":
            var random = Date.now()
            var filepath = path.join(__dirname + `/../public/assets/js/ai-audio-${random}.wav`)
            await writePromise(filepath, aiRes.outputAudio, 'binary');
            response.json({ text: result, random: random })
            return
          case "AgentNameGet":
            if (aiName) {
              echo = `${result} ${aiName}.`
            } else {
              echo = `I don't have a name, why don't you give me one?`
            }
            break
          case "AgentNameChange":
          case "AgentNameSave":
            aiName = aiRes.queryResult.parameters.fields['given-name'].stringValue
            echo = result
            break
          case "Past":
            await getPast(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue, result)
            return
          case "Now":
            await getPresent(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue, result)
            return
          case "Future":
            await getFuture(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue, result)
            return
          default: echo = result
        }
        // Use the context from this response for next queries
        executeQueries(projectId, sessionId, [`Echoing ${echo} EndOutput`], languageCode, false);
      } catch (error) {
        console.log(error);
      }
    }
  }
  executeQueries(projectId, sessionId, queries, languageCode, true);
})

module.exports = router
