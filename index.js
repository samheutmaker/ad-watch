const staff = require('staff');

// Gets all current ads from Craiglist Url
var getCurrentAds = require(__dirname + '/lib/get-current-ads.js');

// Url To Watch
const mainUrl = 'https://seattle.craigslist.org/search/cta';



// Initalize
watchAds({
  url: 'https://seattle.craigslist.org/search/cta',
  keywords: ['ford'],
  price: {
    max: 40000,
    min: 10000
  }
});


// var options = {
//   url: 'https://seattle.craigslist.org/search/cta', 
//   keywords: ['bmw'], 
//   price: {
//     max: 4500,
//     min: 1000
//   }
// };


function watchAds(o) {

  setInterval(function() {
    getCurrentAds(o.url).then(function(scrapedContent) {
      filterAds(scrapedContent, o);
    }, function(err) {
      console.log(err);
    });
  }, 2000);
}


function filterAds(adsArray, options) {
  var matchesToReturn = [];
  var helper = {};

  options.keywords.forEach(function(keyword, keywordIndex) {
    keyword = keyword.toLowerCase();
    helper[keyword] = true;

  });

  adsArray.forEach(function(adString, adStringIndex) {
    adString.split(' ').forEach(function(adWord, adWordIndex) {
      if (helper.hasOwnProperty(adWord.toLowerCase())) {
        matchesToReturn.push(adString);
      }
    })
  });


  matchesToReturn = matchesToReturn.map(function(adString, stringIndex) {
    var toReturn = [];
    adString.split(' ').forEach(function(adWord, wordIndex) {
      if (adWord.split("")[0] === '$') {
        var itemPrice = adWord.slice(1, adWord.length);
        if (itemPrice <= options.price.max && itemPrice >= options.price.min) {
          toReturn.push(adString);
        }
      }
    })
    return toReturn;
  });

console.log(staff.removeDuplicates(matchesToReturn));

}





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
      if (help.hasOwnProperty(termWord.toLowerCase())) {
        // Push term into return array
        matchesToReturn.push(el);
      }
    });
  });

  // Remove duplicates and array containing matches
  return staff.removeDuplicates(matchesToReturn);
}


// Compares ads and return true if they have changed
function compareAds(original, updated) {
  return (original[0] === updated[0]) ? false : true;
};