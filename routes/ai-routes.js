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
    }).then(async function (dbUser) {
      console.log(dbUser)
      if (dbUser !== null) {
        echo = `${aiRes.queryResult.fulfillmentText} ${dbUser.Events[0].dataValues.name} on ${dbUser.Events[0].dataValues.dateTime}`
        executeQueries("echo-fmhq", sessionId, [echo], languageCode);
      } else {
        echo = `${aiRes.queryResult.fulfillmentText} nothing planned.`
        executeQueries("echo-fmhq", sessionId, [echo], languageCode);
      }
    })
  }

  async function getPresent(friend) {
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
    }).then((dbUser) => {
      dbUser.Events[0].dataValues
    })
  }

  async function getFuture(friend) {
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
    }).then(function (dbUser) {
      if (dbUser) {
        return dbUser.Events[0].dataValues
      } else {
        return null
      }
    })
  }

  async function executeQueries(projectId, sessionId, queries, languageCode) {
    // Keeping the context across queries let's us simulate an ongoing conversation with the bot
    let context, aiRes, fromDB, echo, aiName = 'Meets A.I'
    for (const query of queries) {
      try {
        aiRes = await detectIntent(projectId, sessionId, query, context, languageCode);

        switch (aiRes.queryResult.intent.displayName) {
          case "Echo":
            var filepath = path.join(__dirname + "/../public/assets/js/ai-audio.wav")
            await util.promisify(fs.writeFile)(filepath, aiRes.outputAudio, 'binary');
            response.send(aiRes.queryResult.fulfillmentText)
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
            fromDB = await getPast(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue, aiRes)
          //   if (fromDB !== null) {
          //     echo = `${aiRes.queryResult.fulfillmentText} ${fromDB.name} on ${fromDB.dateTime}`
          //   } else {
          //     echo = `${aiRes.queryResult.fulfillmentText} nothing planned.`
          //   }
          //   break
          case "Now":
            fromDB = await getPresent(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue)
            if (fromDB !== null) {
              echo = `${aiRes.queryResult.fulfillmentText} is currently unavailable. ${aiRes.queryResult.fulfillmentText} has ${fromDB.name} planned for ${fromDB.dateTime}`
            } else {
              echo = `${aiRes.queryResult.fulfillmentText} seems to be available. ${aiRes.queryResult.fulfillmentText} has nothing planned on their schedule for the past hour.`
            }
            break
          case "Future":
            fromDB = await getFuture(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue)
            if (fromDB !== null) {
              echo = `${aiRes.queryResult.fulfillmentText} planned for ${fromDB.dateTime}`
            } else {
              echo = `${aiRes.queryResult.fulfillmentText} no future events at this moment.`
            }
            break
          default: echo = aiRes.queryResult.fulfillmentText
        }
        // Use the context from this response for next queries
        context = aiRes.queryResult.outputContexts;
        executeQueries("echo-fmhq", sessionId, [echo], languageCode);
      } catch (error) {
        console.log(error);
      }
    }
  }
  executeQueries(projectId, sessionId, queries, languageCode);
})

module.exports = router
