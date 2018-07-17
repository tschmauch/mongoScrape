var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var GameSchema = new Schema({

	title: {
		type: String,
		required: true
	},

	link: {
		type: String,
		required: true
	},

	imgLink: {
		type: String,
		required: true
	},
	rank: {
		type: String,
		required: true
	},

	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

var Game = mongoose.model("Game", GameSchema);
module.exports = Game;
