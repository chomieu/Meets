const express = require("express");
const router = express.Router();
const db = require("../models");
const user = require("../models/user");

// Routes
// =============================================================

// GET route for getting all of the events and return them to user
router.get("/", function (req, res) {
  db.Event.findAll({}).then(function (dbEvent) {
    res.json(dbEvent)
  }).catch(err => {
    console.log(err.message);
    res.status(500).send(err.message)
  });
});


router.get("/myevents", (req, res) => {
  if (!req.session.user) {
    res.status(404).send("please sign in")
  } else {
    db.User.findAll({
      where: {
        id: req.session.user.id
      },
      include: [db.Event]
    }).then(function (dbEvent) {
      console.log(req.session.user.id);
      res.json(dbEvent)
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    })
  }
})

// POST route to CREATE an event with the data available in req.body
router.post("/", function (req, res) {
  if (!req.session.user) {
    res.status(401).send("You have to login first!")
  } else {
    console.log(req.body)
    db.Event.create({
      UserId: req.session.user.id,
      dateTime: req.body.dateTime,
      name: req.body.name
    }).then(function (dbEvent) {
      // find all events for the signed in user
      db.Event.findAll({
        where: {
          UserId: req.session.user.id
        }
      }).then(eventData => {
        // count the total # of events
        console.log(eventData);
        // update the user with the total # of events
        // find the total number of events after the current date (future events)
        // loop over the array, count the number of events after the current date\
        const today = new Date();
        // filters all events to find only future events
        const upcomingEvents = eventData.filter(element => (element.dateTime) > today);
        db.User.update({
          plans: eventData.length,
          // this will be updated on page load as well
          upcoming_plans:upcomingEvents.length
        }, {
          where: {
            id: req.session.user.id
          }
        }).then(userData => {
          res.json(userData)
        }).catch(err => {
          console.log(err.message);
          res.status(500).send(err.message)
        });
      }).catch(err => {
        console.log(err.message);
        res.status(500).send(err.message)
      });
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    });
  }
})

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

// Delete an event
router.delete("/:id", function (req, res) {
  console.log(req.body.UserId);
  if (req.session.user) {
    // Needs to pass user id of the event
    console.log(req.session.user.id);
    console.log(req.params);
    if (req.session.user.id === parseInt(req.body.UserId)) {
      db.Event.destroy({
        where: {
          id: req.params.id
        },
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
module.exports = router;