var express = require("express");

var router = express.Router();

const db = require('../models')

// use router.get router.post router.put router.delete
router.get("/", (req, res) => {
  res.render("index")
})

// router.get('/login', (req,res) => {
//   res.render('login')
// })

// db.Review.findAll().then(data => {
//   const jsonData = data.map(element => element.toJSON())
//   const hbsObj = {
//     reviews:jsonData
//   }
//   res.render('index',hbsObj)
// })


router.get("/register", (req, res) => {
    res.render("partials/register");
})

router.get("/dashboard", (req, res) => {
    res.render("partials/dashboard");
})

router.get("/events", (req, res) => {
    res.render("partials/events");
})

router.get("/event/edit", (req, res) => {
    res.render("partials/oneEvent");
})

router.get("/friends", (req, res) => {
    res.render("partials/friends");
})

router.get("/friend/one", (req, res) => {
    res.render("partials/oneFriend");
})

router.get("/ai_chat", (req, res) => {
    res.render("partials/aiChat");
})

router.get("/profile", (req, res) => {
    res.render("partials/profile");
})

router.get("/settings", (req, res) => {
    res.render("partials/settings");
})

// Export routes for server.js to use.
module.exports = router;

//login js file

// $("#login").submit(event=>{
//   event.preventDefault();
//   $.post("/login",{
//     username:$("#username").val(),
//     password:$("#password").val()
//   }).then(data => {
//     console.log("Signed up!");
//     window.location.href = '/'
//   }).fail(err => {
//     console.log("Signup failed!");
//     console.log(err);
//     alert("signup failed")
//   })
// })

// $("#addReview").submit(event => {
//   event.preventDefault();
//   $.post('api/reviews', {
//     title: $("#title").val(),
//     reviews:$("#review").val(),
//     score:$("#scpre").val()
//   }).then(data => {
//     window.location.href = '/'
//   }).fail(err => {
//     alert("review failed")
//   })
// })
