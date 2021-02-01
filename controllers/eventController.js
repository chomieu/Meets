const express = require("express");

const router = express.Router();

const db = require("../models");

// use router.get router.post router.put router.delete


// Routes
// =============================================================

// GET route for getting all of the events and return them to user
// router.get("/", function (req, res) {
//   db.Event.findAll({}).then(function (dbEvent) {
//     res.json(dbEvent)
//   }).catch(err => {
//     console.log(err.message);
//     res.status(500).send(err.message)
//   });
// });


router.get("/myevents", (req, res) => {
  if (!req.session.user) {
    res.status(404).send("please sign in")
  } else {
    db.Event.findAll({
      where: {
        UserId: req.sessions.user.id
      }
    })
  }
})

// POST route to CREATE an event with the data available in req.body
router.post("/", function (req, res) {
  if (!req.session.user) {
    res.status(401).send("You have to login first!")
  } else {
    console.log(req.body)
    db.Event.create(req.body).then(function (dbEvent) {
      res.json(dbEvent)
      db.Event.findAll() // find all events for the signed in user, count the total # of events
      db.User.update() // update the user with the total # of events
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    })
  }
});

// PUT route to UPDATE events
router.put("/", function (req, res) {
  if (req.session.user) {
    db.Event.update(req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbEvent) {
        res.json(dbEvent)
      }).catch(err => {
        console.log(err.message);
        res.status(500).send(err.message)
      })
  } else {
    res.send("please sign in")
  }
})
// router.get("/:id", (req, res) => {
//   db.Event.findOne({
//     where: {
//       id: req.params.id
//     }
//   }).then(data => {
//     const jsonData = data.Event.map(obj => obj.toJSON())
//     const hbsobj = {
//       events: jsonData
//     }
//     console.log(req.params.id);
//     res.json(data);
//     res.render('index', hbsobj)
//   }).catch(err => {
//     console.log((err.message));
//     res.status(500).send(err.message);
//   });
// });
// Delete an event
router.delete("/:id", function (req, res) {
  if (req.session.user) {
    // Needs to pass user id of the event
    console.log(req.session.user.id);
    console.log(req.params);
    if (req.session.user.id === parseInt(req.params.id)) {
      db.Event.destroy({
        where: {
          id: req.params.id
        }
      }).then(function (dbEvent) {
        res.json(dbEvent)
      }).catch(err => {
        console.log(err.message);
        res.status(500).send(err.message)
      })
    } else {
      res.send("this is not your event!")
    }

  } else {
    res.send("please sign in")
  }

})






// Export routes for server.js to use.

// TODO: send event to one of our friends? 
module.exports = router;