var path = require('path');
var maxmind = require('maxmind');
var countryLookup = maxmind.openSync(path.join(__dirname, '../data/GeoLite2-Country.mmdb'));

module.exports = function (request, reply) {
    var ip = request.info.remoteAddress;
    var xForwardedForHeader = request.headers['x-forwarded-for'];
    if (xForwardedForHeader) {
        ip = xForwardedForHeader.split(/\s*,\s*/)[0];
    }
    reply(countryLookup.get(ip) || {});
}