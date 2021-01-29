var express = require("express");
var db = require("../models");

var router = express.Router();

// use router.get router.post router.put router.delete


// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the events and return them to user
  router.get("/api/events", function(req, res) {
    db.Event.findAll({}).then(function(dbEvent){
      res.json(dbEvent)
    }).catch(err =>{
      console.log(err.message);
      res.status(500).send(err.message)
    });
  });

    // POST route to CREATE an event with the data available in req.body
    router.post("/api/events", function(req,res){
      db.Event.create(req.body).then(function(dbEvent){
        res.json(dbEvent)
      }).catch(err =>{
        console.log(err.message);
        res.status(500).send(err.message)
      })
    });


    // PUT route to UPDATE events
    router.put("/api/events", function(req, res){
      db.Event.update(req.body,
        {
          where: {
            id: req.body.id
          }
        }).then(function(dbEvent) {
          res.json(dbEvent)
        }).catch(err =>{
          console.log(err.message);
          res.status(500).send(err.message)
        })
    })
    
    // Delete an event
    router.delete("/api/events:id", function(req,res){
      db.Event.destroy({
        where: {
          id: req.params.id
        }
      }).then(function(dbEvent){
        res.json(dbEvent)
      }).catch(err =>{
        console.log(err.message);
        res.status(500).send(err.message)
      })
    })
  };


    
// Export routes for server.js to use.
module.exports = router;