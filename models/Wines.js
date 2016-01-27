var mongoose = require('mongoose');

var WineSchema = new mongoose.Schema({
	name: String,
	varietal: String,
	vintage: {type: Number, min: 2000},
	appellation: {
		name: {type: String},
		country: {type: String}
	},
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

WineSchema.methods.addWine = function(cb) {
	this.save();
	console.log('I have save a wine via the addWine function, doing any checks you need');
}

mongoose.model('Wine', WineSchema);