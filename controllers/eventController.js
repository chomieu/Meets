const express = require("express");
const db = require("../models");
const router = express.Router();

// use router.get router.post router.put router.delete


// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the events and return them to user
  router.get("/", function(req, res) {
    db.Event.findAll({}).then(function(dbEvent){
      res.json(dbEvent)
    }).catch(err =>{
      console.log(err.message);
      res.status(500).send(err.message)
    });
  });
  

  router.get("/myevents", (req,res)=>{
    if(!req.session.user){
      res.status(404).send("please sign in")
    } else{
      db.Event.findAll({
        where: {
          UserId:req.sessions.user.id
        }
      })
    }
  })

    // POST route to CREATE an event with the data available in req.body
    router.post("/", function(req,res){
      if(!req.session.user){
        res.status(401).send("You have to login first!")
      }
      db.Event.create(req.body).then(function(dbEvent){
        res.json(dbEvent)
      }).catch(err =>{
        console.log(err.message);
        res.status(500).send(err.message)
      })
    });

    // PUT route to UPDATE events
    router.put("/", function(req, res){
      if(req.session.user){
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
      } else{
        res.send("please sign in")
      }
    })
    
    // Delete an event
    router.delete("/:id", function(req,res){
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

// TODO: send event to one of our friends? 
module.exports = router;