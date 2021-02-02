const express = require("express")
const router = express.Router();
const db = require("../models");
const dialogflow = require("@google-cloud/dialogflow").v2;
const path = require('path')
const sound = require("sound-play")
const now = new Date()
const Sequelize = require('sequelize');
const Op = Sequelize.Op

router.post('/api/input', (request, response) => {
  const projectId = 'meets-dnx9';
  const sessionId = '123456';
  const queries = [request.body.input]
  const languageCode = 'en';
  const sessionClient = new dialogflow.SessionsClient(); // Instantiates a session client
  const fs = require('fs'); // for writing audio output
  const util = require('util');

  async function detectIntent(projectId, sessionId, query, contexts, languageCode) {
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

    if (projectId === "echo-fmhq") {
      request.outputAudioConfig = { audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16', }
    }

    if (contexts && contexts.length > 0) {
      request.queryParams = { contexts: contexts, }
    }

    const responses = await sessionClient.detectIntent(request)
    return responses[0];
  }

  // Find user's friend in the request and get their events
  async function getPast(friend, aiRes) {
    // grab one from past/future/now depending on time
    db.User.findOne({
      where: {
        username: friend
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
      dbUser === null ? echo = `${aiRes.queryResult.fulfillmentText} nothing planned.` :
        echo = `${aiRes.queryResult.fulfillmentText} ${dbUser.Events[0].dataValues.name} on ${dbUser.Events[0].dataValues.dateTime}`
      executeQueries("echo-fmhq", sessionId, [echo], languageCode);
    })
  }

  async function getPresent(friend, aiRes) {
    // grab one from past/future/now depending on time
    db.User.findOne({
      where: {
        username: friend
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
      dbUser === null ? echo = `${aiRes.queryResult.fulfillmentText} seems to be available. ${aiRes.queryResult.fulfillmentText} has nothing planned on their schedule for the past hour.` :
        echo = `${aiRes.queryResult.fulfillmentText} is currently unavailable. ${aiRes.queryResult.fulfillmentText} has ${dbUser.Events[0].dataValues.name} planned for ${dbUser.Events[0].dataValues.dateTime}`
      executeQueries("echo-fmhq", sessionId, [echo], languageCode);
    })
  }

  async function getFuture(friend, aiRes) {
    // grab one from past/future/now depending on time
    db.User.findOne({
      where: {
        username: friend
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
      dbUser === null ? echo = `${aiRes.queryResult.fulfillmentText} no future events at this moment.` :
        echo = `${aiRes.queryResult.fulfillmentText} planned for ${dbUser.Events[0].dataValues.dateTime}`
      executeQueries("echo-fmhq", sessionId, [echo], languageCode);
    })
  }

  async function executeQueries(projectId, sessionId, queries, languageCode) {
    const writePromise = util.promisify(fs.writeFile)
    // Keeping the context across queries let's us simulate an ongoing conversation with the bot
    let context, aiRes, echo, aiName = 'Meets A.I'
    for (const query of queries) {
      try {
        aiRes = await detectIntent(projectId, sessionId, query, context, languageCode);
        context = aiRes.queryResult.outputContexts;

        switch (aiRes.queryResult.intent.displayName) {
          case "Echo":
            var random = Date.now()
            var filepath = path.join(__dirname + `/../public/assets/js/ai-audio-${random}.wav`)
            await writePromise(filepath, aiRes.outputAudio, 'binary');
            response.json({text: aiRes.queryResult.fulfillmentText, random: random})
            return
          case "AgentNameGet":
            if (aiName) {
              echo = `${aiRes.queryResult.fulfillmentText} ${aiName}.`
            } else {
              echo = `I don't have a name, why don't you give me one?`
            }
            break
          case "AgentNameChange":
          case "AgentNameSave":
            aiName = aiRes.queryResult.parameters.fields['given-name'].stringValue
            echo = aiRes.queryResult.fulfillmentText
            break
          case "Past":
            await getPast(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue, aiRes)
            return
          case "Now":
            await getPresent(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue, aiRes)
            return
          case "Future":
            await getFuture(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue, aiRes)
            return
          default: echo = aiRes.queryResult.fulfillmentText
        }
        // Use the context from this response for next queries
        executeQueries("echo-fmhq", sessionId, [echo], languageCode);
      } catch (error) {
        console.log(error);
      }
    }
  }
  executeQueries(projectId, sessionId, queries, languageCode);
})

module.exports = router
