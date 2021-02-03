$('document').ready(function () {
  // Initiates when connectBtn is clicked
  $(".connectBtn").on("click", function () {
    var id = $(this).data("id") // Grabs the other user's id
    var connected = $(this).data("connection") // Boolean

    // If user is already connected make a DELETE request
    if (connected) {
      $.ajax("/disconnect", {
        type: "DELETE",
        data: { associateId: id }
      }).then(() => {
        location.reload();
      });
    } else { // Otherwise make a PUTrequest
      $.ajax("/connect", {
        type: "PUT",
        data: { associateId: id }
      }).then(() => {
        location.reload();
      });
    }
  })
})