var path = require('path');
var maxmind = require('maxmind');
var countryjs = require('countryjs');
var countryLookup = maxmind.openSync(path.join(__dirname, '../data/GeoLite2-Country.mmdb'));

module.exports = function (request, reply) {
    var ip = request.info.remoteAddress;
    var xForwardedForHeader = request.headers['x-forwarded-for'];
    if (xForwardedForHeader) {
        ip = xForwardedForHeader.split(/\s*,\s*/)[0];
    }
    var countryData = countryLookup.get(ip);
    if(countryData) {
      countryData.country.tld = countryjs.info(countryData.country.iso_code).tld[0];
      countryData.registered_country.tld = countryjs.info(countryData.country.iso_code).tld[0];
    }
    reply(countryData || {});
};