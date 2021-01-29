var express = require("express");

var router = express.Router();

// use router.get router.post router.put router.delete
router.get("/", (req, res) => {
    res.render("index")
})

router.get("/register", (req, res) => {
    res.render("partials/register");
})

router.get("/dashboard", (req, res) => {
    res.render("partials/dashboard");
})

router.get("/events", (req, res) => {
    res.render("partials/events");
})

router.get("/events/:id", (req, res) => {
    res.render("partials/one_event");
})

router.get("/friends", (req, res) => {
    res.render("partials/friends");
})

router.get("/profile", (req, res) => {
    res.render("partials/profile");
})

router.get("/settings", (req, res) => {
    res.render("partials/settings");
})

// Export routes for server.js to use.
module.exports = router;