// Takes a CraigsList Url as the only parameter
// and returns a Promise with all the current listed ads
const xray = require('x-ray')();
module.exports = exports = function(urlToRetreiveFrom) {
  return new Promise(function(resolve, reject) {
    xray(urlToRetreiveFrom, {
      currentAds: ['.row']
    })((err, scrapedContent) => {
      (err) ? reject(err) : resolve(scrapedContent.currentAds);
    });
  });
};