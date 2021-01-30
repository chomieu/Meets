// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require("express");
const session = require("express-session")

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

// Requiring our models for syncing
const db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Allows for login sessions via cookies, login lasts for two hours
// TODO: Future-development: Secure cookies!
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialize: false,
  cookie: {
    maxAge: 1000*60*60*2
  }
}))

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Requiring our routes for user dialogue
const userDialogueRoutes = require("./controllers/userDialogueController.js");
app.use("/api", userDialogueRoutes)

// Requiring our routes for the user
const userRoutes = require("./controllers/userController.js");
app.use(userRoutes)

// Review routes from joe's demo
const reviewRoutes = require("./controllers/reviewController.js");
app.use("/api/reviews", reviewRoutes)

// Syncing our sequelize models and then starting our express app
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

// just an app that takes input of name, activities, plans, and install all plans in table; boolean - private?; if not private others will be able to see it 