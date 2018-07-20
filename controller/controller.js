var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

	var db = require("../models");

	app.get("/", (req, res) => {

		db.Article.find({})
			.then(function (dbArticle) {
				var hbsObject = {
					dbArticle
				};
				res.render("index", hbsObject);
			})
			.catch(function (err) {
				res.json(err);
			});
	});
	app.get("/index", (req, res) => {

		db.Article.find({})
			.then(function (dbArticle) {
				var hbsObject = {
					dbArticle
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
				db.Article.create(result)
					.then(function (dbArticle) {
						console.log(dbArticle);
					})
					.catch(function (err) {
						return res.json(err);
					});
			});
			res.send("Scrape Complete");
		});
	});

	app.get("/Articles", function (req, res) {
		db.Article.find({})
			.then(function (dbArticle) {
				res.json(dbArticle);
			})
			.catch(function (err) {
				res.json(err);
			});
	});

	app.put("/RemoveArticleNotes/:id", function (req, res) {
		db.Article.findOne({
				_id: req.params.id
			})
			.populate("note")
			.then(function (result) {
				console.log("result", result.note._id);
				db.Note.findOne({
						_id: result.note._id
					}).remove()
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

	app.get("/Articles/:id", function (req, res) {
		db.Article.findOne({
				_id: req.params.id
			})
			.populate("note")
			.then(function (dbArticle) {
				res.json(dbArticle);
			})
			.catch(function (err) {
				res.json(err);
			});
	});

	app.post("/Articles/:id", function (req, res) {
		db.Note.create(req.body)
			.then(function (dbNote) {
				return db.Article.findOneAndUpdate({
					_id: req.params.id
				}, {
					note: dbNote._id
				}, {
					new: true
				});
			})
			.then(function (dbArticle) {
				res.json(dbArticle);
			})
			.catch(function (err) {
				res.json(err);
			});
	});
}