var express = require("express");

var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {


	var db = require("../models");

	// Routes
	app.get("/", (req, res) => {

		db.Game.find({})
			.then(function (dbGame) {
				var hbsObject = {
					dbGame
				};
				res.render("index", hbsObject);
			})
			.catch(function (err) {
				res.json(err);
			});
	});
	app.get("/index", (req, res) => {

		db.Game.find({})
			.then(function (dbGame) {
				var hbsObject = {
					dbGame
				};
				res.render("index", hbsObject);
			})
			.catch(function (err) {
				res.json(err);
			});
	});
	app.get("/scrape", function (req, res) {
		axios.get("https://boardgamegeek.com/browse/boardgame").then(function (response) {
			var $ = cheerio.load(response.data);

			$("tr#row_").each(function (i, element) {
				var result = {};


				result.title = $(this).find("td.collection_objectname").children("div").find("a").text();
				result.link = "https://boardgamegeek.com" + $(this).find("td.collection_objectname").children("div").find("a").attr("href");
				result.imgLink = $(this).find("td.collection_thumbnail").find("a").find("img").attr("src");
				result.rank = $(this).find("td.collection_rank").find("a").attr("name");

				console.log(result);
				db.Game.create(result)
					.then(function (dbGame) {
						console.log(dbGame);
					})
					.catch(function (err) {
						return res.json(err);
					});
			});

			res.send("Scrape Complete");
		});
	});

	app.get("/Games", function (req, res) {
		db.Game.find({})
			.then(function (dbGame) {
				res.json(dbGame);
			})
			.catch(function (err) {
				res.json(err);
			});
	});

	app.put("/RemoveGameNotes/:id", function (req, res) {
		db.Game.findOne({ _id: req.params.id })

			.populate("note")

			.then(function (result) {
				console.log("result", result.note._id);
				db.Note.findOne({ _id: result.note._id }).remove()
					.then(function (deleteresult) {
						console.log("delete", deleteresult);
					});
				res.json(result);
			})
			.catch(function (err) {
				console.log(err);
				res.json(err);
			});

	});

	app.get("/Games/:id", function (req, res) {
		db.Game.findOne({ _id: req.params.id })
			.populate("note")
			.then(function (dbGame) {
				res.json(dbGame);
			})
			.catch(function (err) {
				res.json(err);
			});
	});

	app.post("/Games/:id", function (req, res) {
		db.Note.create(req.body)
			.then(function (dbNote) {
				return db.Game.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
			})
			.then(function (dbGame) {
				res.json(dbGame);
			})
			.catch(function (err) {
				res.json(err);
			});
	});
}