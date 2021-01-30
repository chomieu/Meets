const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const router = express.Router();

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
  

  // router.get("/myevents", (req,res)=>{
  //   if(!req.session.user){
  //     res.status(404).send("dumb")
  //   } else{
  //     db.Event.findAll({
  //       where: {
  //         UserId:req.sessions.user.id
  //       }
  //     })
  //   }
  // })

    // POST route to CREATE an event with the data available in req.body
    router.post("/api/events", function(req,res){
      // if(!req.session.user){
      //   res.status(401).send()
      // }
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

  // router.post("/login", (req,res)=>{
  //   db.User.findOne({
  //     where: {
  //       name:req.body.name
  //     }
  //   }).then(userData=>{
  //     if(!userData){
  //       res.status(404).send("no user")
  //     } else{
  //       if(bcrypt.compareSync(req.body.password,userData.password)){
  //         req.sessions.userID
  //         res.json(userData)
  //       } else{
  //         res.status(401).send("wrong password")
  //       }
  //     }
  //   })
  // })

  // router.get("/readsessions", (req,res)=>{
    
  //   res.json(req.session)
  // })

  // router.get("/secretclub",(req,res)=>{
  //   if(req.session.user){
  //     res.send("welcome to the club")
  //   } else{
  //     req.session.destroy();
  //     res.status(401).send("login first silly goose")
  //   }
  // })

  // router.get("/logout", (req,res)=>{
  //   req.session.destroy()
  // })
    
// Export routes for server.js to use.

// TODO: send event to one of our friends? 
module.exports = router;