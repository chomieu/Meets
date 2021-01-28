$(document).ready(function () {
    $('.loginForm').on("submit", (e) => {
        e.preventDefault()
        console.log("test");
    })

    $('.content').mouseover(function () {
        console.log("here");
        $(this).removeClass('bc1')
        $(this).addClass('bc4')
    }).mouseleave(function () {
        $(this).removeClass('bc4')
        $(this).addClass('bc1')
    })
})