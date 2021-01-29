var SpeechSDK
var recognizer

$(function () {
  $("#submitBtn").on("click", function (event) {
    // Make sure to preventDefault on a submit event
    event.preventDefault()
    var input = { input: $("#input").val() }
    $("#history").append($("<li>", { class: "col s12", text: $("#input").val() }))
    // Send the POST request
    $.ajax("/api/input", {
      type: "POST",
      data: input
    }).then((res) => {
      $("#history").append($("<li>", { class: "col s12 cyan-text", text: res }))
      $("#input").val("")
    }
    );
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

        var input = { input: result.privText }
        $("#history").append($("<li>", { class: "col s12", text: result.privText }))

        // Send the POST request
        $.ajax("/api/input", {
          type: "POST",
          data: input
        }).then((res) => {
            $("#history").append($("<li>", { class: "col s12 cyan-text", text: res }))
          }
        );
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