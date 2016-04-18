const mongoose = require('mongoose');
const xray = require('x-ray')();


// Watch Schema
var watchSchema = mongoose.Schema({
    url: {
        type: String,
    },
    hooks: {
        type: Array,
    },
    currentAds: {
        type: Array,
    }
});


// Initalize
watchSchema.methods.initialize = function(url, hookId) {

    this.url = url;
    this.addHook(hookId);
    this.save((err, savedWatch) => {
        savedWatch.updateAds().then(function(newAds) {
            console.log(newAds);
        }, function(err) {
            console.log(err);
        });
    });
};

// Get Current Ads
watchSchema.methods.updateAds = function() {
    return new Promise((resolve, reject) => {
        xray(this.url, {
            currentAds: ['.row']
        })((err, scrapedContent) => {
            (err) ? reject(err) : resolve(scrapedContent.currentAds);
        });
    });
};

// Add Hook
watchSchema.methods.addHook = function(hookId) {
    this.hooks.push(hookId);
    this.save();
};

// Remove Hook
watchSchema.methods.removeHook = function(hookId) {
    this.hooks.splice(this.hooks.indexOf(hookId), 1);
    this.save();
};


// Export Model
module.exports = exports = mongoose.model('WatchModel', watchSchema);