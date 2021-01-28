// // *****************************************************************************
// // Server.js - This file is the initial starting point for the Node/Express server.
// //
// // ******************************************************************************
// // *** Dependencies
// // =============================================================
// var express = require("express");

// // Sets up the Express App
// // =============================================================
// var app = express();
// var PORT = process.env.PORT || 8080;

// // Requiring our models for syncing
// var db = require("./models");

// // Requiring our routes
// var routes = require("./controllers/controller.js");
// app.use(routes)


// // Sets up the Express app to handle data parsing
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

app.post('/', (request, response) => {
  dialogflowFulfillment(request, response)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

// app.get('/', (req, res) => {
//   res.send(meetsResponse)
//   })

const dialogflowFulfillment = (request, response) => {
  const agent = new WebhookClient({ request, response })

  function handler(agent) {
    const meetsResponse = request.body // req.body holds the JSON output
    agent.add(meetsResponse.queryResult.fulfillmentText.replace(".", " ") + "at " + d.getHours() % 12 + " PM $wag") // Adds custom response back to the AI's dialog
    // console.log(meetsResponse) // the entire object
    // console.log(meetsResponse.queryResult.queryText) // the original question
    // console.log(meetsResponse.queryResult.parameters.person.name) // person's name
    // console.log(meetsResponse.queryResult.fulfillmentText) // AI response
  }

  // let intentMap = new Map();
  // intentMap.set("Default Welcome Intent", sayHello)
  agent.handleRequest(handler)

}