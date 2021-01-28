// Requiring models
var db = require("../models");

// routes
module.exports = app => {

  // GET route for getting all of the user's dialogue
  app.get("/api/userdialogue", (req,res) => {
    let query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    db.UserDialogue.findAll({
      where: query
    }).then(dbUserDialogue => {
      res.json(dbUserDialogue);
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message);
    });
  });

  // POST route for saving new dialogue
  app.post("/api/userdialogues", (req,res) => {
    db.Post.create(req.body).then(data)
  })
  // DELETE and UPDATE unnecessary? This is intended to be a record only of the dialogue exchanged between the user and the AI
}