var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var port = process.env.port || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


var expressHandlebars = require("express-handlebars");

app.engine("handlebars", expressHandlebars({defaultLayout: 'main'}));
app.set("view", "handlebars");

require("./controller/controller.js")(app);
app.listen(port, function() {
  console.log("App running on port " + port);
});