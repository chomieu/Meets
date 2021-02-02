var express = require("express");
const { Session } = require("express-session");

var router = express.Router();
const db = require('../models')

// use router.get router.post router.put router.delete
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

// list of the upcoming events for user, top Y?
// TODO: get request to fetch data and render. Reference date(ORDER BY DESC) and userid tied to event 
router.get("/api/allEvents/:id", function (req, res) {
  if (req.session.user) {
    db.Event.findAll({
      where: {
        id: req.params.id
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
    res.render('index')
  }
});


// GET route to fetch associations and events from the database to display on the dashboard
router.get("/dashboard", (req, res) => {
  // TODO: Toggle to findAll friends events instead
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
        // console.log('-------------------');
        // console.log(aSockData);
        // console.log('-------------------');
        // console.log(userData);
        // res.json(aSockData)
        const hbsObj = {
          user: req.session.user, // include this in EVERY hbars object for every route that renders a page
          userEvents: userData.Events,
          friends: aSockData
        }
        console.log(hbsObj);
        // res.json(hbsObj)
        res.render("partials/dashboard", hbsObj);
      })
    }).catch(err => {
      console.log(err);
      res.status(500).json(err)
    })
  } else {
    res.render('index')
  }
})

// takes you to a single event?
// find one single event and all the associated data
router.get("/api/events/:id", (req, res) => {
  if (req.session.user) {
    db.Event.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbEvent) {
      const dbEventsJson = dbEvent.toJSON()
      const hbsobj = {
        user:req.session.user,
        events: dbEventsJson
      }
      console.log(dbEventsJson);
      console.log(hbsobj);
      res.render('./partials/oneEvent', hbsobj)
      // console.log(req.params.id);
      // res.json(data);

    }).catch(err => {
      console.log((err.message));
      res.status(500).send(err.message);
    });
  } else {
    res.send("please sign in")
  }
})

// friends activities - query the user's associations, then query the associations events and return the Z events for them at that time (of the original event)

router.get("/api/friendEvents/:id", (req, res) => {
  if (req.session.user) {
    db.User.findOne({
      where: {
        id: req.params.id
        // swap with req.session.user.id if they need to be logged in
      },
      include: [{
        model: db.User,
        as: 'Associate',
        include: [db.Event]
      }]
      // [{

      // model: db.UserAssociate,
      // include: [db.Event]
      // }]

    }).then(function (dbAssociate) {
      const dbAssociateJson = dbAssociate.toJSON()
      const hbsobj = {
        user: req.session.user,
        events: dbAssociateJson
      }
      // console.log(dbEventsJson);
      // console.log(hbsobj);
      res.render('./partials/oneFriend', hbsobj)
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    })
  } else {
    res.render('index')
  }
})

// query for any associate that has an event at the same time
// TODO: ???
router.get("/events", (req, res) => {
  res.render("partials/events");
})


// TODO: new event route
router.get("/event/new", (req, res) => {
  res.render("partials/oneEvent");
})


// findOne for a single event, then check to make sure that you are logged in and that you are the admin
// TODO: findOne() event while ensuring logged in userID and userID who created event are the same 

// if true, then you can edit and access the POST request

// QUERY to findOne event

// TODO: ???
// pass content of event with ID = X
// send isEdit boolean --> if TRUE then EDITABLE (on frontend)
router.get("/event/edit", (req, res) => {
  res.render("partials/oneEvent");
})
// Already handled in eventcontroller with put request?

// findAll where you have an assciation with them
router.get("/friends/:id", (req, res) => { // use friends/:id if they don't need to be logged in
  if (req.session.user) {
    // find a single user that is logged in
    db.User.findOne({
      where: {
        id: req.params.id //req.session.user.id if they need to be logged in
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
        user:req.session.user,
        username: userJson.username
      }
      //pass that object to the frontend
      // res.json(userData)
      res.render("partials/friends", hbsObj);
    }).catch(err => {
      res.status(500).json(err)
    })
  } else {
    res.render('index')
  }
})

// findOne user, findAll events for that user
router.get("/friend/one", (req, res) => {
  res.render("partials/oneFriend");
})

// chat - when AI is asked for past/future intent of TARGETNAME - query TARGETNAME for event in past/future -
// maybe a POST request to the AI handler with a GET request to the database nested inside?
router.get("/ai_chat", (req, res) => {
  res.render("partials/aiChat");
})

// can this be the same as the dashboard? any extra info?
router.get("/profile", (req, res) => {
  res.render("partials/profile");
})

// update username/password/first name/last name/etc
// query for single user who is logged in
router.get("/settings/:id", (req, res) => {
  if (req.session.user) {
  db.User.findOne({
    where: {
      id: req.params.id
    }
  }).then(dbUser => {
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
  res.render('index')
}
})

// Export routes for server.js to use.
module.exports = router;

//login js file

// $("#login").submit(event=>{
//   event.preventDefault();
//   $.post("/login",{
//     username:$("#username").val(),
//     password:$("#password").val()
//   }).then(data => {
//     console.log("Signed up!");
//     window.location.href = '/'
//   }).fail(err => {
//     console.log("Signup failed!");
//     console.log(err);
//     alert("signup failed")
//   })
// })

// $("#addReview").submit(event => {
//   event.preventDefault();
//   $.post('api/reviews', {
//     title: $("#title").val(),
//     reviews:$("#review").val(),
//     score:$("#scpre").val()
//   }).then(data => {
//     window.location.href = '/'
//   }).fail(err => {
//     alert("review failed")
//   })
// })


// router.get('/login', (req,res) => {
//   res.render('login')
// })

// db.Review.findAll().then(data => {
//   const jsonData = data.map(element => element.toJSON())
//   const hbsObj = {
//     reviews:jsonData
//   }
//   res.render('index',hbsObj)
// })