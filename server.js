// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
// const session = 
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Requiring our routes
require("./controllers/api-controller.js")(app);
// app.use(routes)


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialize: false,
//   cookie: {
//     maxAge: 1000*60*60*2
//   }
// }))

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Syncing our sequelize models and then starting our express app
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

