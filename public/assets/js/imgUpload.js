$('document').ready(function () {
  $('input[type=file]').on('change', function () {
    var $files = $(this).get(0).files;

    if ($files.length) {
      // Reject big files
      if ($files[0].size > $(this).data('max-size') * 1024) {
        console.log('Please select a smaller file');
        return false;
      }

      // Begin file upload
      console.log('Uploading file to Imgur..');

      var formData = new FormData();
      formData.append('image', $files[0]);

      // Response contains stringified JSON
      // Image URL available at response.data.link
      $.ajax({
        type: "POST",
        url: "https://api.imgur.com/3/image",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
          "Authorization": "Client-ID 08bc9cecc19e296",
        }
      }).done(function (response) {
        $.ajax("/profile/update", {
          type: "PUT",
          data: {
            image: response.data.link
          }
        }).then((res) => {
          $("#pfp").attr("src", response.data.link)
        }).catch((err) => {
          $(".red-text").text("Picture is too large!")
        })
      });
    }
  });

  $('#updateBtn').on('click', function (e) {
    e.preventDefault()
    let newUsername = $("#username").val()
    let newPassword = $("#password").val()
    $.ajax("/profile/update", {
      type: "PUT",
      data: {
        username: newUsername,
        password: newPassword
      }
    }).then((res) => {
      $("#username").val("")
      $("#password").val("")
    }).catch((err) => {
      $(".red-text").text("Picture is too large!")
    })
  })
});