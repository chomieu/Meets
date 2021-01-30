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