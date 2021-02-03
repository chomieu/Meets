$(document).ready(function () {
    $('.sidenav').sidenav();



    let page = localStorage['currentPage']
    $(`.${page}`).addClass("activePage")

    $('.dashboardBtn').on("click", function () {
        localStorage['currentPage'] = "dashboardBtn"
    })
    $('.eventBtn').click(function () {
        localStorage['currentPage'] = "eventBtn"
    })
    $('.friendsBtn').click(function () {
        localStorage['currentPage'] = "friendsBtn"
    })
    $('.profileBtn').click(function () {
        localStorage['currentPage'] = "profileBtn"
    })
    $('.settingsBtn').click(function () {
        localStorage['currentPage'] = "settingsBtn"
    })
    $('.aichatBtn').click(function () {
        localStorage['currentPage'] = "aiChatBtn"
    })
})
