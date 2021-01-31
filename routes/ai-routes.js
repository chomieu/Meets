const db = require("../models");
const dialogflow = require('@google-cloud/dialogflow'); 

module.exports = function (app) {
  app.post('/api/input', (request, response) => {
    const projectId = 'meets-dnx9'; 
    const sessionId = '123456'; 
    const queries = [request.body.input] 
    const languageCode = 'en'; 
    const sessionClient = new dialogflow.SessionsClient(); // Instantiates a session client

    async function detectIntent(projectId, sessionId, query, contexts, languageCode) {
      // The path to identify the agent that owns the created intent.
      const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
      // The text query request.
      const request = {
        session: sessionPath,
        queryInput: { text: { text: query, languageCode: languageCode, }, },
      };

      if (contexts && contexts.length > 0) {
        request.queryParams = { contexts: contexts, };
      }

      const responses = await sessionClient.detectIntent(request);
      return responses[0];
    }

    // Find user's friend in the request and get their events
    async function getData(friend) {
      db.User.findOne({
        where: {
          name: friend
        },
        include: [db.Event]
      }).then(function(dbUser) {
        response.json(dbUser)
      })
    }

    async function executeQueries(projectId, sessionId, queries, languageCode) {
      // Keeping the context across queries let's us simulate an ongoing conversation with the bot
      let context, aiRes, fromDB
      for (const query of queries) {
        try {
          aiRes = await detectIntent(projectId, sessionId, query, context, languageCode);
          fromDB = await getData(aiRes.queryResult.parameters.person.name)
          // write a function to choose 1 (past/future/now) event from DB or respond that there's no plan
          function matchIntent(fromDB) {
            var eventJSON = fromDB.Event[0]
          }
          switch (aiRes.queryResult.intent.displayName) {
            case "Boss":
              response.send(`${aiRes.queryResult.fulfillmentText} `) // pass userID (should be same as sessionID) here
            case "Past":
              response.send(`${aiRes.queryResult.fulfillmentText} at 10PM $wag`)
              break
            case "Now":
              response.send(`${aiRes.queryResult.fulfillmentText} would you like to know what's on their schedule?`)
              break
            case "Future":
              response.send(`${aiRes.queryResult.fulfillmentText} would you like to join them?`)
              break
            default: response.send(aiRes.queryResult.fulfillmentText)
          }
          // Use the context from this response for next queries
          context = aiRes.queryResult.outputContexts;
        } catch (error) {
          console.log(error);
        }
      }
    }
    executeQueries(projectId, sessionId, queries, languageCode);
  })
};

