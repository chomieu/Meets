$(document).ready(function () {
    $('.newEvent').on("submit", (e) => {
        e.preventDefault()
        let dateTime = $('#dateTime').val()
        let name = $('#name').val();
        let numOfPeople = $('#numOfPeople').val();
        let location = $('#location').val();
        let category = $('#category').val();

        let input = {
            dateTime: dateTime,
            name: name,
            // numOfPeople: numOfPeople,
            // location: location,
            // category: category
        }

        $.ajax("/api/events", {
            type: "POST",
            data: input
        }).then(resp => {
            console.log(resp);
            window.location("/events")
        })
    })
})