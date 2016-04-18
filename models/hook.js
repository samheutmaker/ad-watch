const mongoose = require('mongoose');

const Watch = require(__dirname + '/watch');

// Hook Schema
var hookSchema = mongoose.Schema({
	url: {type: String, required: true},
	owner_id: String,
	keywords: Array,
	price: {
		min: Number,
		max: Number
	}
});


hookSchema.methods.initialize = function() {
	Watch.findOne({url: this.url}, (err, watchItem) => {
		if(err) return console.log(err);
		// Watch
		if(watchItem) {
			watchItem.addHook(this._id);
		} else {
			var newWatch = new Watch();
			
			newWatch.save((err, watchData) => {
				watchData.initialize(this.url, this._id);
			});

		}
	});	
}


module.exports = exports = mongoose.model('HookModel', hookSchema);