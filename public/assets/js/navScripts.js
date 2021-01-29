$(document).ready(function () {
    $('.sidenav').sidenav();

    let page = localStorage['currentPage']
    $(`.${page}`).addClass("activePage disable")

    $('.dashboardBtn').on("click", function () {
        localStorage['currentPage'] = "dashboardBtn"
        console.log("dashboard");
    })
    $('.eventBtn').click(function () {
        localStorage['currentPage'] = "eventBtn"
        console.log("event");
    })
    $('.friendsBtn').click(function () {
        localStorage['currentPage'] = "friendsBtn"
        console.log("friends");
    })
    $('.profileBtn').click(function () {
        localStorage['currentPage'] = "profileBtn"
        console.log("profile");
    })
    $('.settingsBtn').click(function () {
        localStorage['currentPage'] = "settingsBtn"
        console.log("settings");
    })
})
