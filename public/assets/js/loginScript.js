$(document).ready(function () {
    $('.loginForm').on("submit", (e) => {
        e.preventDefault()
        console.log("Login Form Submitted");

        console.log($('#pass').val());
        console.log($('#username').val());

        let input = {
            username: $('#username').val(),
            password: $('#pass').val()
        }

        $.ajax("/login", {
            type: "POST",
            data: input
        }).then((resp) => {
            console.log(resp);
            sessionStorage['user'] = JSON.stringify(resp)
            window.location = (`/dashboard`)
        })

    })

    $('.regForm').on("submit", (e) => {
        e.preventDefault()
        console.log("Reg Form Submitted");

        console.log($('#pass').val());
        console.log($('#username').val());

        let input = {
            username: $('#username').val(),
            password: $('#pass').val()
        }

        $.ajax("/signup", {
            type: "POST",
            data: input
        }).then((resp) => {
            console.log(resp);
        })
    })

    $('.content').mouseover(function () {
        $(this).removeClass('bc1')
        $(this).addClass('bc2')
    }).mouseleave(function () {
        $(this).removeClass('bc2')
        $(this).addClass('bc1')
    })
})