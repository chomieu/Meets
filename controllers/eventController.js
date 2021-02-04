const express = require("express");
const router = express.Router();
const db = require("../models");
const user = require("../models/user");

// Routes
// =============================================================

//bulk event create
router.get('/seedevents', (req,res) => {
  db.Event.findAll().then(allEvents => {
    if (allEvents.length === 0) {
      db.Event.bulkCreate([{
        UserId: req.session.user.id,
        name: "Build a Rocket",
        max_people: 100,
        isPublic: false,
        location: 'Planet Earth',
        category: 'Casual',
        isIndoor: true,
        dateTime: "3/1/21 12:00",
        description: "We are building a rocket to fly to the moon!"
      },
      {
        UserId: req.session.user.id,
        name: "Dance Party on the Moon!",
        max_people: 4,
        isPublic: false,
        location: 'Europa',
        category: 'Casual',
        isIndoor: false,
        dateTime: "3/15/21 16:00",
        description: "It is time to dance on the moon!"
      },
      {
        UserId: req.session.user.id,
        name: "Space burgers",
        max_people: 4,
        isPublic: false,
        location: 'Saturn',
        category: 'Food',
        isIndoor: false,
        dateTime: "3/15/21 17:00",
        description: "We brought burgers with us to the moon"
      },
      {
        UserId: req.session.user.id,
        name: "Return to home",
        max_people: 4,
        isPublic: false,
        location: 'Space',
        category: 'Casual',
        isIndoor: false,
        dateTime: "3/17/21 06:00",
        description: "Time to return to home"
      },
      {
        UserId: req.session.user.id,
        name: "Pet the cats and relax",
        max_people: 20,
        isPublic: true,
        location: 'Neko Cat Cafe',
        category: 'Casual',
        isIndoor: true,
        dateTime: "3/18/21 17:00",
        description: "After a long day on the moon, its time to relax with some friends and pet a cat"
      },
      {
        UserId: req.session.user.id,
        name: "Sleep",
        max_people: 1,
        isPublic: false,
        location: 'Bed',
        category: 'Casual',
        isIndoor: true,
        dateTime: "3/18/21 21:00",
        description: "Sleep it off"
      }]).then(eventSeed => {
        res.send('Seeds created')
      }).catch(err => {
        console.log(err);
        res.json(err)
      })
    } else {
      res.send('Already seeded')
    }
  }).catch(err => {
    console.log(err);
    res.json(err);
  })
})

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
      max_people: req.body.max_people,
      name: req.body.name,
      isPublic: req.body.isPublic,
      isIndoor: req.body.isIndoor,
      category: req.body.category,
      location: req.body.location,
      description: req.body.description
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
          upcoming_plans: upcomingEvents.length
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
router.put("/:id", function (req, res) {
  if (req.session.user) {
    db.Event.update(req.body,
      {
        where: {
          id: req.params.id
        }
      }).then(function (dbEvent) {
      console.log(dbEvent);
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