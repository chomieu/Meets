var express = require("express");
const db = require('../models')

var router = express.Router();

// use router.get router.post router.put router.delete

// GET route for retrieving all dialogue from a single user
router.get("/userdialogue/:id", (req, res) => {
  db.UserDialogue.findAll(
    {
    where: {
      id:req.params.id
    }
  }
  ).then(dbUserDialogue => {
    res.json(dbUserDialogue);
  }).catch(err => {
    console.log(err.message);
    res.status(500).send(err.message);
  });
});

// POST route for saving new dialogue to the USERDIALOGUE table
router.post("/userdialogue", (req, res) => {
  console.log(req.body);
  db.UserDialogue.create(req.body).then(dbUserDialogue => {
    res.json(dbUserDialogue)
  }).catch(err => {
    console.log(err.message);
    res.status(500).send(err.message);
  });
});

module.exports = router;