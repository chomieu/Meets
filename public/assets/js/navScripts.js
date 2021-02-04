$(document).ready(function () {
    $('.sidenav').sidenav();



    let page = localStorage['currentPage']
    $(`.${page}`).addClass("activePage")
    console.log(page);
    let pageEl = $(`.${page}`)[0]
    console.log(pageEl);
    let pageElLastChild = pageEl.lastChild;
    $(pageElLastChild).addClass("icon-activate")

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
    $('.aiChatBtn').click(function () {
        localStorage['currentPage'] = "aiChatBtn"
    })
})
