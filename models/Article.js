var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
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
	}
});

var Article = mongoose.model("Article", ArticleSchema);

// Export Article model
module.exports = Article;