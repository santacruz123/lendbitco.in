'use strict';

angular.module('gulpangular')
  .service('Ripple', function ($window, FED) {

    var ripple = $window.window.ripple;
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
        currency: RippleBonds.currencyCodes[symbol[0]],
        issuer: FED
      };

      // Bids

      remote.requestBookOffers({
        gets: currencyOpt,
        pays: bondOpt
      }, function (err, data) {
        var newPrice = typeof data.offers[0] !== 'undefined' ?
          getPriceFromOffer(data.offers[0], 'bid') : 0;

        cb(newPrice, null);
      });


      // Asks

      remote.requestBookOffers({
        gets: bondOpt,
        pays: currencyOpt
      }, function (err, data) {
        var newPrice = typeof data.offers[0] !== 'undefined' ?
          getPriceFromOffer(data.offers[0], 'ask') : 0;

        cb(null, newPrice);
      });


      // var bids = remote.book(optBids);

      // bids.offers(function (offers) {
      //   var newPrice = typeof offers[0] !== 'undefined' ? getPriceFromOffer(offers[0], 'bid') : 0;
      //   cb(newPrice);
      // });

      // bids.on('transaction', function () {
      //   var tmpBids = remote.book(optBids);
      //   tmpBids.offers(function (offers) {
      //     console.log(offers);
      //     var newPrice = typeof offers[0] !== 'undefined' ? getPriceFromOffer(offers[0], 'bid') : 0;
      //     cb(newPrice);
      //   });
      // });
      // asks

      //   var optAsks = {
      //     /* jshint ignore:start */
      //     issuer_gets: issuer,
      //     currency_gets: symbol,
      //     issuer_pays: FED,
      //     currency_pays: RippleBonds.currencyCodes[symbol[0]]
      //     /* jshint ignore:end */
      //   };

      //   var asks = remote.book(optAsks);

      //   // asks.offers(function (offers) {
      //   //   var newPrice = typeof offers[0] !== 'undefined' ? getPriceFromOffer(offers[0], 'ask') : 0;
      //   //   cb(null, newPrice);
      //   // });

      //   asks.on('transaction', function () {
      //     var offers = asks.offersSync();
      //     console.log(offers);
      //     var newPrice = typeof offers[0] !== 'undefined' ? getPriceFromOffer(offers[0], 'ask') : 0;
      //     cb(null, newPrice);
      //   });
    }

    return {
      watchBondPrices: watchBondPrices
    };
  });
