$(document).ready(function () {
    $('select').formSelect();
    $('#textarea1').val('');
    M.textareaAutoResize($('#textarea1'));
    $('#textarea2').val();
    M.textareaAutoResize($('#textarea2'));

    $('.newEvent').on("submit", (e) => {
        e.preventDefault()
        let dateTime = $('#dateTime').val()
        let name = $('#name').val()
        let numOfPeople = $('#numOfPeople').val()
        let location = $('#location').val()
        let category = $('#category').val()
        let description = $('#textarea1').val()
        let isIndoor = $('#isIndoor').val()
        let isPublic = $('#isPublic').val()

        let input = {
            dateTime: dateTime,
            name: name,
            max_people: numOfPeople,
            location: location,
            category: category,
            description: description,
            isIndoor: isIndoor,
            isPublic: isPublic
        }

        $.ajax("/api/events", {
            type: "POST",
            data: input
        }).then(resp => {
            console.log(resp);
            window.location = ("/upcomingEvents")
        })
    })

    // delete Event
    $(".deleteEvent").on("click", function () {
        let eventId = $(this).data("id")
        let UserId = $(this).data("userid")


        console.log("*****************************");
        console.log(this);
        // console.log($(this));
        console.log(`eventId: ${eventId} UserId: ${UserId}`);

        let input = {
            UserId: UserId
        }


        $.ajax(`/api/events/${eventId}`, {
            type: "DELETE",
            data: input
        }).then(resp => {
            window.location = ("/events")
        })
    })
})