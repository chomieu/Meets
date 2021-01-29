const express = require('express');
const bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment');
const { DateTime } = require('actions-on-google');
const { response } = require('express');
const path = require('path');
const d = new Date()
const app = express()
const port = process.env.PORT || 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static("public"))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + "/index.html"))
})

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
          case "Past": response.send(`${intentResponse.queryResult.fulfillmentText} at ${d.getHours() % 12} PM $wag`); break
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})