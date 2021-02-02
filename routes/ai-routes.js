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
  console.log(now)
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
  function getPast(friend) {
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
    }).then(function (dbUser) {
      return dbUser.Events[0]
    })
  }

  function getPresent(friend) {
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
    }).then(function (dbUser) {
      if (dbUser) {
        return dbUser.Events[0]
      } else {
        return 0
      }
    })
  }

  function getFuture(friend) {
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
      return dbUser.Events[0]
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
            await util.promisify(fs.writeFile)("ai-audio.wav", aiRes.outputAudio, 'binary');
            var filepath = path.join(__dirname + "/../public/assets/ai-audio.wav")
            sound.play(filepath)
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
          case "Boss":
            echo = `${aiRes.queryResult.fulfillmentText} Chomie.` // pass userID (should be same as sessionID) here
            break
          case "Past":
            fromDB = await getPast(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue)
            echo = `${aiRes.queryResult.fulfillmentText} at 10PM $wag.`
            break
          case "Now":
            fromDB = await getPresent(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue)
            echo = `${aiRes.queryResult.fulfillmentText}, would you like to know what's on their schedule?`
            break
          case "Future":
            fromDB = await getFuture(aiRes.queryResult.parameters.fields.person.structValue.fields.name.stringValue)
            echo = `${aiRes.queryResult.fulfillmentText}, would you like to join them?`
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
