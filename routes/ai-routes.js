var db = require("../models");

module.exports = function (app) {
  // AI Routes
  app.post('/api/input', (request, response) => {
    const projectId = 'meets-dnx9'; // projectId: ID of the GCP project where Dialogflow agent is deployed
    const sessionId = '123456'; // sessionId: String representing a random number or hashed user identifier
    const queries = [request.body.input] // queries: A set of sequential queries to be send to Dialogflow agent for Intent Detection
    const languageCode = 'en'; // languageCode: Indicates the language Dialogflow agent should use to detect intents
    const dialogflow = require('@google-cloud/dialogflow'); // Imports the Dialogflow library
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

    async function executeQueries(projectId, sessionId, queries, languageCode) {
      // Keeping the context across queries let's us simulate an ongoing conversation with the bot
      let context;
      let intentResponse;
      for (const query of queries) {
        try {
          intentResponse = await detectIntent(projectId, sessionId, query, context, languageCode);
          switch (intentResponse.queryResult.intent.displayName) {
            case "Boss":
              response.send(`${intentResponse.queryResult.fulfillmentText} `) // pass userID here
            case "Past":
              // write function
              response.send(`${intentResponse.queryResult.fulfillmentText} at 10PM $wag`)
              break
            case "Now":
              // write function
              response.send(`${intentResponse.queryResult.fulfillmentText} would you like to know what's on their schedule?`)
              break
            case "Future":
              // write function
              response.send(`${intentResponse.queryResult.fulfillmentText} would you like to join them?`)
              break
            default: response.send(intentResponse.queryResult.fulfillmentText)
          }
          // Use the context from this response for next queries
          context = intentResponse.queryResult.outputContexts;
        } catch (error) {
          console.log(error);
        }
      }
    }
    executeQueries(projectId, sessionId, queries, languageCode);
  })
};

// app.get("/api/authors", function (req, res) {
//     // Here we add an "include" property to our options in our findAll query
//     // We set the value to an array of the models we want to include in a left outer join
//     // In this case, just db.Post
//     db.Author.findAll({
//         include: [db.Post]
//     }).then(function (dbAuthor) {
//         res.json(dbAuthor);
//     });
// });

// app.get("/api/authors/:id", function (req, res) {
//     // Here we add an "include" property to our options in our findOne query
//     // We set the value to an array of the models we want to include in a left outer join
//     // In this case, just db.Post
//     db.Author.findOne({
//         where: {
//             id: req.params.id
//         },
//         include: [db.Post]
//     }).then(function (dbAuthor) {
//         res.json(dbAuthor);
//     });
// });

// app.post("/api/authors", function (req, res) {
//     db.Author.create(req.body).then(function (dbAuthor) {
//         res.json(dbAuthor);
//     });
// });

// app.delete("/api/authors/:id", function (req, res) {
//     db.Author.destroy({
//         where: {
//             id: req.params.id
//         }
//     }).then(function (dbAuthor) {
//         res.json(dbAuthor);
//     });
// });