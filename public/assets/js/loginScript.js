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
            sessionStorage['user'] = JSON.stringify(resp)
            localStorage['currentPage'] = "dashboardBtn"
            window.location = ("/dashboard")
        }).catch((err) => {
            $(".red-text").text(err)
        })

    })

    $('.regForm').on("submit", (e) => {
        e.preventDefault()
        console.log("Reg Form Submitted");

        console.log($('#pass').val());
        console.log($('#username').val());

        let input = {
            username: $('#username').val(),
            password: $('#pass').val(),
            email: $('#email').val(),
            first_name: $('#first-name').val(),
            last_name: $('#last-name').val()
        }

        $.ajax("/signup", {
            type: "POST",
            data: input
        }).then((resp) => {
            sessionStorage['user'] = JSON.stringify(resp)
            localStorage['currentPage'] = "dashboardBtn"
            window.location = ("/login") // daniel -- replace dashboard with login, signup does not automatically log you in
        }).catch((err) => {
            $(".red-text").text(err)
        })
    })
})