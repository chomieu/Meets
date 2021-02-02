var express = require("express");
const { Session } = require("express-session");

var router = express.Router();
const db = require('../models')

// Landing page, same as login page
router.get("/", (req, res) => {
  res.render("index")
})

// Signup route
router.get("/signup", (req, res) => {
  res.render("partials/register")
})

// Login route
router.get("/login", (req, res) => {
  res.render("index")
})

// list of the upcoming events for user
router.get("/allEvents", function (req, res) {
  if (req.session.user) {
    db.Event.findAll({
      where: {
        id: req.session.user.id
      },
      order: [
        ['dateTime', "DESC"]
      ]
    }).then(function (dbEvent) {
      const hbsObj = {
        user: req.session.user,
        eventData: dbEvent
      }
      res.render('./partials/events', hbsObj)
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    });
  } else {
    res.redirect(401, '/login')
  }
});


// GET route to fetch associations and events from the database to display on the dashboard
router.get("/dashboard", (req, res) => {
  // TODO: Future Dev - Toggle to findAll friends events instead
  // findOne user and all of their events

  // AI fetches a user and target feeds into this call
  if (req.session.user) {
    db.User.findOne({
      attributes: ['username'],
      where: {
        id: req.session.user.id //req.session.user.id if they need to be logged in
      },
      include: [{
        model: db.Event,
        attributes: ['UserId', 'name'],
        limit: 10
      }]
    }).then(userData => {
      userData.getAssociate(
        {
          attributes: ['username'],
          limit: 2, // values can be changed
          include: [{
            model: db.Event,
            attributes: ['UserId', 'name'],
            limit: 2 // value can be changed
          }]
        }
      ).then(aSockData => {
        const hbsObj = {
          user: req.session.user, // include this in EVERY hbars object for every route that renders a page
          userEvents: userData.Events,
          friends: aSockData
        }
        console.log(hbsObj);
        res.render("partials/dashboard", hbsObj);
      })
    }).catch(err => {
      console.log(err);
      res.status(500).json(err)
    })
  } else {
    res.redirect(401, '/login')
  }
})

// find one single event and all the associated data
router.get("/events/:id", (req, res) => {
  if (req.session.user) {
    db.Event.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbEvent) {
      const dbEventsJson = dbEvent.toJSON()
      const hbsobj = {
        user: req.session.user,
        events: dbEventsJson
      }
      console.log(dbEventsJson);
      console.log(hbsobj);
      res.render('./partials/oneEvent', hbsobj)
    }).catch(err => {
      console.log((err.message));
      res.status(500).send(err.message);
    });
  } else {
    res.redirect("/");
  }
})

// friends activities - query the user's associations, then query the associations events and return the Z events for them at that time (of the original event)

router.get("/friendEvents", (req, res) => {
  if (req.session.user) {
    db.User.findOne({
      where: {
        id: req.session.user.id
      },
      include: [{
        model: db.User,
        as: 'Associate',
        include: [db.Event]
      }]
    }).then(function (dbAssociate) {
      const dbAssociateJson = dbAssociate.toJSON()
      const hbsobj = {
        user: req.session.user,
        events: dbAssociateJson
      }
      res.render('./partials/oneFriend', hbsobj)
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    })
  } else {
    res.redirect(401, '/login')
  }
})

// query for any associate that has an event at the same time
router.get("/sameTime/", function (req, res) {
  // if(req.body.dateTime===req.params.id)
  db.Event.findAll({
    where: {
      dateTime: req.body.dateTime
    },
    include: [{
      model: db.User,
      include: [{
        model: db.User,
        as: 'Associate',
        // include: [db.Event]
      }],
    }],

  }).then(function (dbAssociateEvents) {
    const dbAssociateEventsJson = dbAssociateEvents.map(element => element.toJSON())
    const hbsobj = {
      events: dbAssociateEventsJson,
      user: req.session.user
    }
    // res.json(dbAssociateEvents)

    // console.log(dbEventsJson);
    // console.log(hbsobj);
    res.render('./partials/events', hbsobj)
  }).catch(err => {
    console.log(err.message);
    res.status(500).send(err.message)
  })
})

// render all events for the logged in user
router.get("/events", (req, res) => {
  if (!req.session.user) {
    res.redirect(401, '/login')
  } else {
    db.User.findAll({
      where: {
        id: req.session.user.id
      },
      include: [db.Event]
    }).then(dbEvent => {
      const dbEventJson = dbEvent.map(e => e.toJSON())
      const hbsObj = {
        user: req.session.user,
        events: dbEventJson
      }
      res.render("partials/events", hbsObj);
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    })
  }
})

// render the new event route
router.get("/event/new", (req, res) => {
  res.render("partials/oneEvent", { isNewRecord: true });
})

// TODO: Render the edit event page if you are logged in and you are the owner
// pass content of event with ID = X
// send isEdit boolean --> if TRUE then EDITABLE (on frontend)
router.get("/event/edit/:event_id", (req, res) => {
  if (!req.session.user) {
    res.redirect(401, '/login')
  } else {
    db.Event.findOne({
      where: {
        id: req.params.event_id
      }
    }).then(dbEvent => {
      const dbEventJson = dbEvent.toJSON();
      // handlebars object should include a isMine key (true/false)
      // if true, then the user logged in is the owner of the event
      // so the event should be editable
      if (req.session.user) {
        dbEventJson.isMine = req.session.user.id === dbEventJson.User.id
      } else {
        dbEventJson.isMine = false;
      }
      const hbsObj = {
        user: req.session.user,
        events: dbEventJson
      };
      res.render("partials/oneEvent", hbsObj);
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    })
  }
})

// findAll where you have an assciation with them
router.get("/friends", (req, res) => {
  if (req.session.user) {
    // find a single user that is logged in
    db.User.findOne({
      where: {
        id: req.session.user.id
      },
      include: [{
        model: db.User,
        as: 'Associate',
      }]
    }).then(userData => {
      // take data that is an object with all of the users associations, turn it into JSON
      console.log(userData);
      const userJson = userData.toJSON();
      // make an object that is just the usernames of the associations
      const hbsObj = {
        user: req.session.user,
        username: userJson
      }
      //pass that object to the frontend
      // res.json(userData)
      res.render("partials/friends", hbsObj);
    }).catch(err => {
      res.status(500).json(err)
    })
  } else {
    res.redirect(401, '/login')
  }
})

// findOne user, findAll events for that user
//TODO:
router.get("/friend/one/:friend_id", (req, res) => {
  if (req.session.user) {
    // find a single user that is logged in
    db.User.findOne({
      where: {
        id: req.session.user.id
      },
      include: [{
        model: db.User,
        as: 'Associate',
        where: {
          id: req.params.friend_id
        }
      }]
    }).then(userData => {
      // take data that is an object with all of the users associations, turn it into JSON
      console.log(userData);
      const userJson = userData.toJSON();
      // make an object that is just the usernames of the associations
      const hbsObj = {
        user: req.session.user,
        username: userJson
      }
      //pass that object to the frontend
      // res.json(userData)
      res.render("partials/oneFriend", hbsObj);
    }).catch(err => {
      res.status(500).json(err)
    })
  } else {
    res.redirect(401, '/login')
  }
})

// chat - when AI is asked for past/future intent of TARGETNAME - query TARGETNAME for event in past/future -
// maybe a POST request to the AI handler with a GET request to the database nested inside?
//TODO:
router.get("/ai_chat", (req, res) => {
  res.render("partials/aiChat");
})

// TODO: Bonus if needed
// can this be the same as the dashboard? any extra info?
// router.get("/profile", (req, res) => {
//   res.render("partials/profile");
// })

// update username/password/first name/last name/etc


// query for single user who is logged in
router.get("/settings", (req, res) => {
  if (req.session.user) {
    db.User.findOne({
      where: {
        id: req.session.user.id
      }
    }).then(userData => {
      // take data that is an object with all of the users associations, turn it into JSON
      const userJson = userData.toJSON();
      // make an object that is just the username and password for editing?
      const hbsObj = {
        user: req.session.user,
        username: userJson.username,
        password: userJson.password
      }
      //pass that object to the frontend
      res.render("partials/settings", hbsObj);
    }).catch(err => {
      res.status(500).json(err)
    })
  } else {
    res.redirect(401, '/login')
  }
})

// Export routes for server.js to use.
module.exports = router;