const staff = require('staff');
const xray = require('x-ray')();


function WatchAds(options) {
  this.url = options.url;
  this.keywords = options.keywords;
  this.price = {
    max: options.price.max,
    min: options.price.min
  };
  this.currentAds = [];
  this.lastAds = [];
}

// Get the current Ads Listed
WatchAds.prototype.getCurrentAds = function() {
  return new Promise((resolve, reject) => {
    xray(this.url, {
      currentAds: ['.row']
    })((err, scrapedContent) => {
      (err) ? reject(err) : resolve(scrapedContent.currentAds);
    });
  });
};

// Filter Ads 
WatchAds.prototype.filterAds = function(adsArray) {
  // Vars
  var matchesToReturn = [];
  var helper = {};
  // Add all keyword to hash
  this.keywords.forEach((keyword, keywordIndex) => {
    
    keyword = keyword.toLowerCase();
    helper[keyword] = true;

  });
  // Find ads with matching keywords
  adsArray.forEach((adString, adStringIndex) => {

    adString.split(' ').forEach((adWord, adWordIndex) => {
      if (helper.hasOwnProperty(adWord.toLowerCase())) {
        matchesToReturn.push(adString);
      }
    })
  });
  // Filter by price
  matchesToReturn = matchesToReturn.map((adString, stringIndex) => {
    var toReturn = [];
    adString.split(' ').forEach((adWord, wordIndex) => {
      if (adWord.split("")[0] === '$') {
        var itemPrice = adWord.slice(1, adWord.length);
        if (itemPrice <= this.price.max && itemPrice >= this.price.min) {
          toReturn.push(adString);
        }
      }
    })
    return toReturn;
  });
  // Return current Ads
  return staff.removeDuplicates(matchesToReturn);
};



// Begin watching ads
WatchAds.prototype.beginWatch = function() {

  setInterval(() => {
    this.getCurrentAds().then((scrapedContent) => {
      var filteredAds = this.filterAds(scrapedContent);
      if (this.currentAds[0] !== filteredAds[0]) {
        this.lastAds = this.currentAds;
        this.currentAds = filteredAds;
      }

      console.log(this.currentAds);
    }, function(err) {
      console.log(err);
    })
  }, 1000);

};


// Export Watch Prototype
module.exports = exports = WatchAds;