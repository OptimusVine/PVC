var mongoose = require('mongoose');

var WineSchema = new mongoose.Schema({
	name: {type: String, required: true},
	varietal: String,
	vintage: {  type: Number, 
				min: 2000, 
				required: 'A valid vintage is required' },			
	appellation: {
		name: {type: String},
		country: {type: String}  },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
	url: String,
	plm_id: Number
});

WineSchema.methods.addWine = function(err) {
	this.save();
	console.log('I have save a wine via the addWine function, doing any checks you need');
}

mongoose.model('Wine', WineSchema);