// var SpeechSDK
var recognizer

$('document').ready(function () {
  $(".aiForm").on("submit", function (event) {
    // Make sure to preventDefault on a submit event
    event.preventDefault()
    var toAI = { input: $("#input").val() }
    $("#history").append($("<p>", { class: "col s12", text: $("#input").val() }))
    $("#input").val("")
    // Send the POST request
    $.ajax("/api/input", {
      type: "POST",
      data: toAI
    }).then(async (res) => {
      $("#history").append($("<p>", { class: "col s12 my-tc1", text: res.text }))
      let sX = new Audio(`/assets/js/ai-audio-${res.random}.wav`)
      await sX.play()
      if (!res) {
        $("#history").append($("<p>", { class: "col s12 my-tc1", text: "Something went wrong, please try again." }))
      }
    })
  });

  $("#recBtn").on("click", function () {
    $("#recBtn").prop("disabled", true)
    // Use the subscription key and configure the SpeechSDK object provided by the file referenced in the index.html file.
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("20bad3c2c2a34e2a9ada0c04f778f495", "eastus");
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
        $("#recBtn").prop("disabled", false)

        var toAI = { input: result.privText }
        $("#history").append($("<p>", { class: "col s12", text: result.privText }))

        // Send the POST request
        $.ajax("/api/input", {
          type: "POST",
          data: toAI
        }).then((res) => {
          $("#history").append($("<p>", { class: "col s12 my-tc1", text: res }))
          if (!res) {
            $("#history").append($("<p>", { class: "col s12 my-tc1", text: "Something went wrong, please try again." }))
          }
        })

        // Log the result.
        window.console.log(result)

        // Close the SpeechRecognizer object, and set the variable to undefined.
        recognizer.close();
        recognizer = undefined;
      },
      // If there's an error.
      function (err) {
        // Also sets the button to work again.
        $("#recBtn").prop("disabled", false)
        // log error to the console.
        window.console.log(err);

        // Close the SpeechRecognizer object, and set the variable to undefined.
        recognizer.close();
        recognizer = undefined;
      });
  });
})