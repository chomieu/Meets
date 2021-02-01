const db = require("../models");
const dialogflow = require("@google-cloud/dialogflow").v2;
const path = require('path')
const sound = require("sound-play")

module.exports = function (app) {
  app.post('/api/input', (request, response) => {
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
    // async function getData(friend, intent) {
    //   // grab one from past/future/now depending on time
    //   db.User.findOne({
    //     where: {
    //       name: friend
    //     },
    //     include: [db.Event]
    //   }).then(function(dbUser) {
    //     response.json(dbUser)
    //   })
    // }

    async function executeQueries(projectId, sessionId, queries, languageCode) {
      // Keeping the context across queries let's us simulate an ongoing conversation with the bot
      let context, aiRes, fromDB, echo
      for (const query of queries) {
        try {
          aiRes = await (await detectIntent(projectId, sessionId, query, context, languageCode));
          // fromDB = await getData(aiRes.parameters.person.name, aiRes.intent.displayName)
          // write a function to choose 1 (past/future/now) event from DB or respond that there's no plan
          // function matchIntent(fromDB) {
          //   var eventJSON = fromDB.Event[0]
          // }
          switch (aiRes.queryResult.intent.displayName) {
            case "Echo":
              util.promisify(fs.writeFile)("ai-audio.wav", aiRes.outputAudio, 'binary');
              var filepath = path.join(__dirname + "/../ai-audio.wav")
              sound.play(filepath)
              response.send(aiRes.queryResult.fulfillmentText)
              return
            // case "AgentNameChange":
            // case "AgentNameGet":
            // case "AgentNameSave":
            case "Boss":
              echo = `${aiRes.queryResult.fulfillmentText} Chomie` // pass userID (should be same as sessionID) here
              break
            case "Past":
              echo = `${aiRes.queryResult.fulfillmentText} at 10PM $wag`
              break
            case "Now":
              echo = `${aiRes.queryResult.fulfillmentText} would you like to know what's on their schedule?`
              break
            case "Future":
              echo = `${aiRes.queryResult.fulfillmentText} would you like to join them?`
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
};

