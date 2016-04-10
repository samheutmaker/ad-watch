const xray = require('x-ray')();
const staff = require('staff');

const mainUrl = "https://seattle.craigslist.org/search/cta";


// Initalize
watchAds(mainUrl);

// Watch Ads and Alert on Update
function watchAds(urlToWatch, termToWatchFor) {

  // Get Original List of Ads to Compare against
  getCurrentAdList(urlToWatch).then(function(originalAds) {


  	var currentMatches = findMatches('bmw', originalAds);

    // Check for updated every 30 seconds
    setInterval(function() {
      console.log('Checked');

      // Scrap Craigslist
      getCurrentAdList(urlToWatch).then(function(updatedAds) {
      	console.log(currentMatches);
      	// Find keyword matches in updated ads
      	var newMatches = findMatches('audi', updatedAds);
        // Compare
        if (compareAds(currentMatches, newMatches)) {
          // Log Changes
          console.log('\n\n---=== CHANGED ===---\n\n');

          currentMatches = updatedAds;
        }
      });
    }, 3000);
  }, function(err) {
    console.log(err);
  });
}

// Returns Promise with all currently listed ads
function getCurrentAdList(url) {
  return new Promise(function(resolve, reject) {
    xray(url, {
      currentAds: ['.row']
    })((err, scrapedContent) => {
      (err) ? reject(err) : resolve(scrapedContent.currentAds);
    });
  });
};


// Find and return matches
function findMatches(term, adsToCheck) {
  // Ads with matching terms
  var matchesToReturn = [];
  // Split terms at spaces
  var termsArray = term.split(' ');
  // Hashmap
  var help = {};
  // Assign each term to hash
  termsArray.forEach((el, index) => {
  	el = el.toLowerCase();
    help[el] = true;
  });
  // Iterate through ads and check for matches
  adsToCheck.forEach((el, index) => {
    el.split(' ').forEach((termWord, termIndex) => {
    	// Check hashmap for match
    	if(help.hasOwnProperty(termWord.toLowerCase())) {
    		// Push term into return array
    		matchesToReturn.push(el);
    	}
    });
  });
  // Remove duplicates and array containing matches
  return staff.removeDuplicates(matchesToReturn);
}

// Cancels the watch
function cancelWatchAds(delayInMilli, setIntervalToCancel) {

}

// Compares ads and return true if they have changed
function compareAds(original, updated) { 
  original.forEach(function(ogEl, ogI) {
  	var matched = false;
  	updated.forEach(function(newEl, newI){
  		if(newEl === ogEl) {
  			matched = true;
  		}
  	});
  	if(!matched) {
  		return true;
  	}
  })
 return false;
};

