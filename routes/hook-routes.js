const express = require('express');
const jsonParser = require('body-parser').json();

const Watch = require(__dirname + '/../models/watch');
const Hook = require(__dirname + '/../models/hook');


// Hook Router
const hookRouter = module.exports = exports = express.Router();


// Create new webhook
hookRouter.post('/new', jsonParser, function(req, res) {
	if(req.body.options) {
		// New Web Hook
		var newHook = new Hook(req.body.options);
		// Save properties
		newHook.url = req.body.options.url;	
		newHook.keywords = req.body.options.keywords;
		newHook.price = {
			min: req.body.options.price.min,
			max: req.body.options.price.max
		};
		// Save webhook
		newHook.save((err, newHookData) => {
			if(err) return console.log('There was an error saving');
			// Initalize new web hook
			newHookData.initialize();

		});
	}
});