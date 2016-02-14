var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
	author: String,
	dateCreated: Date,
	upvotes: {type: Number, default: 0},
	wine: { type: mongoose.Schema.Types.ObjectId, ref: 'Wine'}
});

CommentSchema.methods.upvote = function(cb) {
	this.upvotes += 1;
	this.save(cb);
};

mongoose.model('Comment', CommentSchema);