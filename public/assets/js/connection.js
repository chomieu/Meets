$('document').ready(function () {
  $(".connectBtn").on("click", function () {
    var id = $(this).data("id")
    var connectionChange = $(this).data("connection")

    var connectionStatus = {
      connected: connectionChange
    }

    if (connected) {
      $.ajax("/connect", {
        type: "PUT",
        data: { associateId: id }
      }).then(() => {
        location.reload();
      });
    } else {
      $.ajax("/disconnect" + id, {
        type: "DELETE",
        data: { associateId: id }
      }).then(() => {
        location.reload();
      });
    }
  })
})