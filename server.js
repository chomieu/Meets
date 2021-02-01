// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require("express");
const session = require("express-session")

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

// Requiring our models for syncing
const db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

// Allows for login sessions via cookies, login lasts for two hours
// TODO: Future-development: Secure cookies!
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2
  }
}))

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Requiring our routes for user dialogue
const userDialogueRoutes = require("./controllers/userDialogueController.js");
app.use("/api", userDialogueRoutes)

// Requiring our routes for the user
const userRoutes = require("./controllers/userController.js");
app.use(userRoutes)

const htmlRoutes = require("./controllers/html-controller.js");
app.use(htmlRoutes);

// Review routes from joe's demo
const eventRoutes = require("./controllers/eventController.js");
app.use("/api/events", eventRoutes)

// HTML routes
const html_routes = require("./controllers/html-controller.js");
app.use(html_routes)

// AI Routes
const { WebhookClient } = require('dialogflow-fulfillment');
const { DateTime } = require('actions-on-google');
const { response } = require('express');

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
        console.log(`Sending Query: ${query}`);
        intentResponse = await detectIntent(projectId, sessionId, query, context, languageCode);
        console.log('Detected intent');
        switch (intentResponse.queryResult.intent.displayName) {
          case "Past": response.send(`${intentResponse.queryResult.fulfillmentText} at 10PM $wag`); break
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

// Syncing our sequelize models and then starting our express app
db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});