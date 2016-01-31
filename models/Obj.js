var mongoose = require('mongoose');

var ObjSchema = new mongoose.Schema({
		data: {type: Object}
	});

mongoose.model('Obj', ObjSchema);