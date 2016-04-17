var AdWatch = require(__dirname + '/lib/ad-watch');



var options = {
  url: 'https://seattle.craigslist.org/search/cta',
  keywords: ['ford'],
  price: {
    max: 40000,
    min: 10000
  }
};

// Initalize
var BMW = new AdWatch(options);

BMW.beginWatch();




