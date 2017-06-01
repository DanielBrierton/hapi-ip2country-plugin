'use strict';

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/',
        handler: require('./lib/ip-to-country-handler')
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
