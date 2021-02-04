const express = require("express");
const router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt')

// GET route for retrieving all users from USER table
router.get("/api/users", (req, res) => {
  db.User.findAll({
    include: [{
      model: db.User,
      as: 'Associate'
    }]
  }).then(dbUser => {
    if (req.session.user) {
      // find the current logged in user
      const foundUser = dbUser.find(user => user.id === req.session.user.id);
      // searches the found user and builds an array from their associations
      const assocArr = foundUser.Associate.map(e => e.UserAssociate.AssociateId)
      // maps across all users to add the isConnected boolean
      const usersAssocData = dbUser.map(obj => {
        const usersAssocObj = obj.toJSON();
        // if the user id is inside the array, then add true/false to the object
        if (assocArr.includes(usersAssocObj.id)) {
          usersAssocObj.isConnected = true;
        } else {
          usersAssocObj.isConnected = false;
        }
        return usersAssocObj
      })
      res.json(usersAssocData);
    } else {
      // if there is no logged in user, return all data with no connected info
      // should not display a button to connect/disconnect unless logged in
      res.json(dbUser)
    }
  }).catch(err => {
    console.log(err.message);
    res.status(500).send(err.message);
  });
});

// allows user to signup for an account
router.post("/signup", (req, res) => {
  db.User.create(req.body).then(data => {
    console.log(req.body);
    res.json(data);
  }).catch(err => {
    res.status(500).json(err)
  });
});

// allows user to login and saves their session
router.post("/login", (req, res) => {
  db.User.findOne({
    where: {
      username: req.body.username
    }
  }).then(userData => {
    if (!userData) {
      req.session.destroy()
      res.status(404).send("No such user exists!")
    } else {
      if (bcrypt.compareSync(req.body.password, userData.password)) {
        req.session.user = {
          id: userData.id,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          status: userData.status,
          image: userData.image
        }
        res.json(userData)
      } else {
        req.session.destroy()
        res.status(401).send("Wrong password")
      }
    }
  }).catch(err => {
    res.status(500).json(err)
  });
});

// PUT route to add connections, trigger each time a user is followed/friend/etc
router.put("/connect", (req, res) => {
  if (req.session.user) {
    // find the logged in user
    db.User.findOne({
      where: {
        id: req.session.user.id
      }
    }).then(dbUser => {
      // add the targeted user as an association
      dbUser.addAssociate(req.body.associateId)
      res.json(dbUser)
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    })
  } else {
    res.status(401).send("Please login to access this page.")
  }
})

// DELETE route to remove connections between users
router.delete("/disconnect", (req, res) => {
  if (req.session.user) {
    // find the logged in user
    db.User.findOne({
      where: {
        id: req.session.user.id
      }
    }).then(dbUser => {
      // add the targeted user as an association
      dbUser.removeAssociate(req.body.associateId)
      res.json(dbUser)
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    })
  } else {
    res.status(401).send("Please login to access this page.")
  }
})

// allows user to update their username/profile pic/etc
router.put("/profile/update", (req, res) => {
  if (req.session.user) {
    console.log(req.body)
    db.User.update(
      req.body,
      {
        where: {
          id: req.session.user.id
        }
      }).then(dbUser => {
        req.session.user = {
          id: userData.id,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          status: userData.status,
          image: userData.image
        }
        console.log('req.session.user:', req.session.user)
        res.json(dbUser)
      }).catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
      });
  } else {
    res.status(401).send("Please login to access this page.")
  }
});

// just allows you to fetch the data to see if you are logged in
router.get("/readsessions", (req, res) => {
  res.json(req.session)
})

// gives access to pages if you are logged in
router.get("/secretclub", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to teh club, ${req.session.user.username}!`)
  } else {
    res.status(401).send("Please login to access this page.")
  }
});

// allows user to logout
router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/login")
  // res.send('Logged out')
});

// DELETE route for deleting user with a specific id, to terminate an account
// TODO: Future development - Delete flips a boolean to hide it and then checks daily until X days pass before being finally deleted
router.delete("/api/users/:id", (req, res) => {
  db.User.destroy({
    where: {
      id: req.params.id
    }
  }).then(dbUser => {
    res.json(dbUser)
  }).catch(err => {
    console.log((err.message));
    res.status(500).send(err.message);
  });
});

module.exports = router;