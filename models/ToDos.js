var mongoose = require('mongoose');

var ToDoSchema = new mongoose.Schema({
	name: {type: String, required: true},
	summary: {type: String},
	dateAdded: {type: Date}, // Set default to "NOW"
	dateLateUpdate: {type: Date},
	dateDue: {type: Date},
	dateCompleted: {type: Date},
	owner_id: String,
	complete: {type: Boolean, default: false},
	wines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wine'}]
});

ToDoSchema.methods.addToDo = function(err) {
	if(this.save()){
		console.log('A ToDo has been saved to the DB named : ' + this.name);
		}
}

ToDoSchema.methods.completeIt = function(cb) {
	this.complete = true;
	this.save(cb);
}

mongoose.model('ToDo', ToDoSchema);