// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
// var express = require("express");

// Sets up the Express App
// =============================================================
// var app = express();
// var PORT = process.env.PORT || 8080;

// // Requiring our models for syncing
// var db = require("./models");

// // Requiring our routes
// var routes = require("./controllers/controller.js");
// app.use(routes)


// Sets up the Express app to handle data parsing
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Set Handlebars.
// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// // Syncing our sequelize models and then starting our express app
// db.sequelize.sync({ force: false }).then(function() {
//   app.listen(PORT, function() {
//     console.log("App listening on PORT " + PORT);
//   });
// });

const express = require('express');
const bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment');
const path = require('path');
const { DateTime } = require('actions-on-google');
const d = new Date()

const app = express()
app.use(bodyParser.json())
const port = process.env.PORT || 8080

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + "/index.html"))
})

// app.post('/', (request, response) => {
//   dialogflowFulfillment(request, response)
// })

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

// // app.get('/', (req, res) => {
// //   res.send(meetsResponse)
// //   })

// const dialogflowFulfillment = (request, response) => {
//   const agent = new WebhookClient({ request, response })
//   const meetsResponse = request.body 
//   // req.body holds the JSON output
//   // meetsResponse.queryResult.queryText = user input
//   // meetsResponse.queryResult.parameters.person.name = person's name
//   // meetsResponse.queryResult.fulfillmentText = ai response

//   function welcome(agent) { // no changes to welcome intent 
//     agent.add(meetsResponse.queryResult.fulfillmentText)
//   }
  
//   function past(agent) { // custom responses for past intent
//     agent.add(meetsResponse.queryResult.fulfillmentText.replace(".", " ") + "at " + d.getHours() % 12 + " PM $wag") // Adds custom response back to the AI's dialog
//   }

//   let intentMap = new Map();
//   intentMap.set("Default Welcome Intent", welcome)
//   intentMap.set("Past", past)

//   agent.handleRequest(intentMap)

// }



// /**
//  * TODO(developer): UPDATE these variables before running the sample.
//  */
// // projectId: ID of the GCP project where Dialogflow agent is deployed
// const projectId = 'meets-dnx9';
// // sessionId: String representing a random number or hashed user identifier
// const sessionId = '123456';
// // queries: A set of sequential queries to be send to Dialogflow agent for Intent Detection
// const queries = [
//   "How's Joe?",
//   "Hello"
// ]
// // languageCode: Indicates the language Dialogflow agent should use to detect intents
// const languageCode = 'en';

// // Imports the Dialogflow library
// const dialogflow = require('@google-cloud/dialogflow');

// // Instantiates a session client
// const sessionClient = new dialogflow.SessionsClient();

// async function detectIntent(projectId, sessionId, query, contexts, languageCode) {
//   // The path to identify the agent that owns the created intent.
//   const sessionPath = sessionClient.projectAgentSessionPath(
//     projectId,
//     sessionId
//   );

//   // The text query request.
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: query,
//         languageCode: languageCode,
//       },
//     },
//   };

//   if (contexts && contexts.length > 0) {
//     request.queryParams = {
//       contexts: contexts,
//     };
//   }

//   const responses = await sessionClient.detectIntent(request);
//   return responses[0];
// }

// async function executeQueries(projectId, sessionId, queries, languageCode) {
//   // Keeping the context across queries let's us simulate an ongoing conversation with the bot
//   let context;
//   let intentResponse;
//   for (const query of queries) {
//     try {
//       console.log(`Sending Query: ${query}`);
//       intentResponse = await detectIntent(
//         projectId,
//         sessionId,
//         query,
//         context,
//         languageCode
//       );
//       console.log('Detected intent');
//       console.log(
//         `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
//       );
//       // Use the context from this response for next queries
//       context = intentResponse.queryResult.outputContexts;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
// executeQueries(projectId, sessionId, queries, languageCode);


// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// 'use strict';

// // [START dialogflow_quickstart]

// const dialogflow = require('@google-cloud/dialogflow');
// const uuid = require('uuid');

// /**
//  * Send a query to the dialogflow agent, and return the query result.
//  * @param {string} projectId The project to be used
//  */
// async function runSample(projectId = 'your-project-id') {
//   // A unique identifier for the given session
//   const sessionId = uuid.v4();

//   // Create a new session
//   const sessionClient = new dialogflow.SessionsClient();
//   const sessionPath = sessionClient.projectAgentSessionPath(
//     projectId,
//     sessionId
//   );

//   // The text query request.
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         // The query to send to the dialogflow agent
//         text: 'hello',
//         // The language used by the client (en-US)
//         languageCode: 'en-US',
//       },
//     },
//   };

//   // Send request and log result
//   const responses = await sessionClient.detectIntent(request);
//   console.log('Detected intent');
//   const result = responses[0].queryResult;
//   console.log(`  Query: ${result.queryText}`);
//   console.log(`  Response: ${result.fulfillmentText}`);
//   if (result.intent) {
//     console.log(`  Intent: ${result.intent.displayName}`);
//   } else {
//     console.log('  No intent matched.');
//   }
// }
// // [END dialogflow_quickstart]

console.log(process.env)
