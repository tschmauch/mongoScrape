var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


var app = express();
var port = process.env.port || 3000;

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/games";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


require("./controllers/scraper_controller.js")(app);

app.listen(port, function() {
  console.log("App running on port " + port);
});
