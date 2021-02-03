$('document').ready(function () {
  // Initiates when connectBtn is clicked
  $(".connectBtn").on("click", function () {
    var id = $(this).data("id") // Grabs the other user's id
    var connectReq = $(this).data("connection") // Boolean

    // If user is trying to connect make a PUT request
    if (connectReq) {
      $.ajax("/connect", {
        type: "PUT",
        data: { associateId: id }
      }).then(() => {
        location.reload();
      });
    } else { // Otherwise make a DELETE request
      $.ajax("/disconnect", {
        type: "DELETE",
        data: { associateId: id }
      }).then(() => {
        location.reload();
      });
    }
  })
})