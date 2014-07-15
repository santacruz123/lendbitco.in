'use strict';

angular.module('gulpangular')
  .service('Ripple', function ($window, FED) {

    var ripple = $window.window.ripple;
    var rippleBonds = $window.window.rippleBonds;
    var Remote = ripple.Remote;

    var remote = new Remote({
      /* jshint ignore:start */
      trusted: true,
      local_signing: true,
      local_fee: true,
      fee_cushion: 1.5,
      servers: [{
        host: 's1.ripple.com',
        port: 443,
        secure: true
      }, {
        host: 's2.ripple.com',
        port: 443,
        secure: true
      }]
      /* jshint ignore:end */
    });

    remote.connect();

    function getPriceFromOffer(offer, type) {
      if (type === 'bid') {
        if (typeof offer.TakerGets.issuer === 'undefined') {
          return (offer.TakerGets / offer.TakerPays.value / 1000000).toFixed(3);
        } else {
          return (offer.TakerGets.value / offer.TakerPays.value).toFixed(3);
        }
      } else {
        if (typeof offer.TakerPays.issuer === 'undefined') {
          return (offer.TakerPays / offer.TakerGets.value / 1000000).toFixed(3);
        } else {
          return (offer.TakerPays.value / offer.TakerGets.value).toFixed(3);
        }
      }
    }

    function watchBondPrices(issuer, symbol, cb) {

      var bondOpt = {
        currency: symbol,
        issuer: issuer
      };

      var currencyOpt = {
        currency: rippleBonds.currencyCodes[symbol[0]],
        issuer: FED
      };

      function getPricesInit(type) {

        var optBook = type === 'bid' ? {
          issuer_pays: bondOpt.issuer, // jshint ignore:line
          currency_pays: bondOpt.currency, // jshint ignore:line
          issuer_gets: currencyOpt.issuer, // jshint ignore:line
          currency_gets: currencyOpt.currency // jshint ignore:line
        } : {
          issuer_pays: currencyOpt.issuer, // jshint ignore:line
          currency_pays: currencyOpt.currency, // jshint ignore:line
          issuer_gets: bondOpt.issuer, // jshint ignore:line
          currency_gets: bondOpt.currency // jshint ignore:line
        };

        getBookOffersByType(type);

        var book = remote.book(optBook);
        book.on('transaction', function () {
          getBookOffersByType(type);
        });
      }

      function getBookOffersByType(type) {
        var optBookOffers = type === 'bid' ? {
          gets: currencyOpt,
          pays: bondOpt
        } : {
          gets: bondOpt,
          pays: currencyOpt
        };

        remote.requestBookOffers(optBookOffers, getCbBookOffers(type));
      }

      function getCbBookOffers(type) {
        return function (err, data) {
          var newPrice = typeof data.offers[0] !== 'undefined' ?
            getPriceFromOffer(data.offers[0], type) : 0;

          if (type === 'bid') {
            cb(newPrice, null);
          } else {
            cb(null, newPrice);
          }
        };
      }

      angular.forEach(['bid', 'ask'], getPricesInit);
    }

    return {
      watchBondPrices: watchBondPrices,
      setSecret: function (acc, secret) {
        remote.set_secret(acc, secret); // jshint ignore:line
      },
      transaction: function () {
        return remote.transaction();
      },
      remote: function () {
        return remote;
      }
    };
  });
