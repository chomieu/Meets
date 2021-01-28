const express = require('express')
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

var SpeechSDK;
var recognizer;
$("document").ready(function () {

  $("#recordBtn").on("click", function () {
    $("#recordBtn").prop("disabled", true)
    // Use the subscription key and configure the SpeechSDK object provided by the file referenced in the index.html file.
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(process.env.MSSDK_key, "eastus");
    // Set speech recognition language to US English
    speechConfig.speechRecognitionLanguage = "en-US"
    // Add the user's microphone input
    var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    // Create the SpeechRecognizer object
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    // Start the voice recognition method. May need to replace with StartContinuousRecognitionAsync later on for more prolonged recognition
    recognizer.recognizeOnceAsync(
      // If we're successful.
      function (result) {
        // Make the button to start speech recognition work again.
        $("#recordBtn").prop("disabled", false)

        // Log the result.
        window.console.log(result)

        // Close the SpeechRecognizer object, and set the variable to undefined.
        recognizer.close();
        recognizer = undefined;
      },
      // If there's an error.
      function (err) {
        // Also sets the button to work again.
        $("#recordBtn").prop("disabled", false)
        // log error to the console.
        window.console.log(err);

        // Close the SpeechRecognizer object, and set the variable to undefined.
        recognizer.close();
        recognizer = undefined;
      });
  });
})