var expect = require('chai').expect;
var sinon = require('sinon');
var handler = require('../lib/ip-to-country-handler');

describe('IP to Country Handler', function () {
    var sandbox = sinon.sandbox.create();
    var replyStub = sandbox.stub();
    // 8.8.8.8
    var googleDNSCountryData = {
        "continent": {
            "code": "NA",
            "geoname_id": 6255149,
            "names": {
                "de": "Nordamerika",
                "en": "North America",
                "es": "Norteamérica",
                "fr": "Amérique du Nord",
                "ja": "北アメリカ",
                "pt-BR": "América do Norte",
                "ru": "Северная Америка",
                "zh-CN": "北美洲"
            }
        },
        "country": {
            "geoname_id": 6252001,
            "iso_code": "US",
            "names": {
                "de": "USA",
                "en": "United States",
                "es": "Estados Unidos",
                "fr": "États-Unis",
                "ja": "アメリカ合衆国",
                "pt-BR": "Estados Unidos",
                "ru": "США",
                "zh-CN": "美国"
            }
        },
        "registered_country": {
            "geoname_id": 6252001,
            "iso_code": "US",
            "names": {
                "de": "USA",
                "en": "United States",
                "es": "Estados Unidos",
                "fr": "États-Unis",
                "ja": "アメリカ合衆国",
                "pt-BR": "Estados Unidos",
                "ru": "США",
                "zh-CN": "美国"
            }
        }
    };
    
    afterEach(function () {
        sandbox.restore();
    });

    it('should return empty object when remoteAddress is localhost', function () {
        // ARRANGE
        var requestMock = {
            info: {
                remoteAddress: '127.0.0.1'
            },
            headers: {}
        };

        // ACT
        handler(requestMock, replyStub);

        // ASSERT
        expect(replyStub.calledWith({})).to.equal(true);
    });

    it('should return empty object when x-forwarded-for is localhost', function () {
        // ARRANGE
        var requestMock = {
            info: {},
            headers: {
                'x-forwarded-for': '127.0.0.1'
            }
        };

        // ACT
        handler(requestMock, replyStub);

        // ASSERT
        expect(replyStub.calledWith({})).to.equal(true);
    });

    it('should return empty object when remoteAddress is private', function () {
        // ARRANGE
        var requestMock = {
            info: {
                remoteAddress: '192.168.0.4'
            },
            headers: {}
        };

        // ACT
        handler(requestMock, replyStub);

        // ASSERT
        expect(replyStub.calledWith({})).to.equal(true);
    });

    it('should return empty object when x-forwarded-for is private', function () {
        // ARRANGE
        var requestMock = {
            info: {},
            headers: {
                'x-forwarded-for': '192.168.0.4'
            }
        };

        // ACT
        handler(requestMock, replyStub);

        // ASSERT
        expect(replyStub.calledWith({})).to.equal(true);
    });

    it('should return country data when remoteAddress is public', function () {
        // ARRANGE
        var requestMock = {
            info: {
                remoteAddress: '8.8.8.8'
            },
            headers: {}
        };

        // ACT
        handler(requestMock, replyStub);

        // ASSERT
        expect(replyStub.calledWith(googleDNSCountryData)).to.equal(true);
    });

    it('should return country data when x-forwarded-for is public', function () {
        // ARRANGE
        var requestMock = {
            info: {},
            headers: {
                'x-forwarded-for': '8.8.8.8'
            }
        };

        // ACT
        handler(requestMock, replyStub);

        // ASSERT
        expect(replyStub.calledWith(googleDNSCountryData)).to.equal(true);
    });

    it('should return country data for the first IP in the x-forwarded-for header when it is public', function () {
        // ARRANGE
        var requestMock = {
            info: {},
            headers: {
                'x-forwarded-for': '8.8.8.8, 82.200.69.80'
            }
        };

        // ACT
        handler(requestMock, replyStub);

        // ASSERT
        expect(replyStub.calledWith(googleDNSCountryData)).to.equal(true);
    });
});