var express = require("express");

var router = express.Router();

// use router.get router.post router.put router.delete
router.get("/", (req, res) => {
    res.render("index")
})

router.get("/register", (req, res) => {
    res.render("partials/register");
})

// Export routes for server.js to use.
module.exports = router;