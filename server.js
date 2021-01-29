const express = require('express');
const bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment');
const path = require('path');
const { DateTime } = require('actions-on-google');
const d = new Date()

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static("public"))
const port = process.env.PORT || 8080

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + "/index.html"))
})

app.post('/api/input', (request, response) => {
  var x = request.body.input
  getIntent(x)
  response.send(console.log("yay"))
  // dialogflowFulfillment(request, response)
})

// app.post('/input', (request, response) => {
//   console.log("here")
// })

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

const dialogflowFulfillment = (request, response) => {
  const agent = new WebhookClient({ request, response })
  const meetsResponse = request.body 
  // req.body holds the JSON output
  // meetsResponse.queryResult.queryText = user input
  // meetsResponse.queryResult.parameters.person.name = person's name
  // meetsResponse.queryResult.fulfillmentText = ai response

  function welcome(agent) { // no changes to welcome intent 
    agent.add(meetsResponse.queryResult.fulfillmentText)
  }
  
  function past(agent) { // custom responses for past intent
    agent.add(meetsResponse.queryResult.fulfillmentText.replace(".", " ") + "at " + d.getHours() % 12 + " PM $wag") // Adds custom response back to the AI's dialog
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome)
  intentMap.set("Past", past)

  agent.handleRequest(intentMap)

}



function getIntent(input) {
// projectId: ID of the GCP project where Dialogflow agent is deployed
const projectId = 'meets-dnx9';
// sessionId: String representing a random number or hashed user identifier
const sessionId = '123456';
// queries: A set of sequential queries to be send to Dialogflow agent for Intent Detection
const queries = [input]
// languageCode: Indicates the language Dialogflow agent should use to detect intents
const languageCode = 'en';

// Imports the Dialogflow library
const dialogflow = require('@google-cloud/dialogflow');

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient();

async function detectIntent(projectId, sessionId, query, contexts, languageCode) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

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

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
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
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        query,
        context,
        languageCode
      );
      console.log('Detected intent');
      console.log(
        `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
      );
      // Use the context from this response for next queries
      context = intentResponse.queryResult.outputContexts;
    } catch (error) {
      console.log(error);
    }
  }
}
executeQueries(projectId, sessionId, queries, languageCode);}