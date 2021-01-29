//TODO: Login method to compare username and password to the username and password entered
//TODO: Filter database for email so no two accounts can have the same email
const express = require("express");
const router = express.Router();
const db = require('../models')

// handlebars doesn't like the extra data from sequelize, so use the .toJSON method from handlebars to convert to a standard object
router.get('/',(req,res)=>{
  db.Review.findAll().then(data => {
    const jsonData = data.map(element => element.toJSON())
    const hbsObj = {
      reviews:jsonData
    }
    res.render('index',hbsObj)
  })
})

router.get('/login', (req,res) => {
  res.render('login')
})

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