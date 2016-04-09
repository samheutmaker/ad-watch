const xray = require('x-ray')();

const mainUrl = "https://seattle.craigslist.org/search/cta";



watchAds(mainUrl, 300000);


// Watch Ads and Alert on Update
function watchAds(urlToWatch, durationInMilli) {

  // Get Original List of Ads to Compare against
  getCurrentAdList(urlToWatch).then(function(originalAds) {
    // Check for updated every 30 seconds
    setInterval(function() {
    	console.log('Checked');

      // Scrap Craigslist
      getCurrentAdList(urlToWatch).then(function(updatedAds) {
        // Compare
        if (compareAds(originalAds, updatedAds)) {
          // Log Changes
          console.log('---=== CHANGED ===---');
          originalAds = updatedAds;
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

// Cancels the watch
function cancelWatchAds(delayInMilli, setIntervalToCancel) {

}

// Compares ads and return true if they have changed
function compareAds(originalAdCache, updatedAdCache) {
  return originalAdCache[0] !== updatedAdCache[0];
}