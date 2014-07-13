'use strict';

angular.module('gulpangular')
  .service('Ripple', function ($window, FED, $rootScope) {

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

    function watchBondPrices(issuer, symbol, bond) {

      // Test what when modifying bond

      function getPriceFromOffer(offer, type) {

        // If somebody selling bond for XRP
        //
        // "TakerGets": "6250428327",
        // "TakerPays": {
        //   "currency": "USD",
        //   "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        //   "value": "26.741141747517"
        // }

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

      // bids
      var optBids = {
        /* jshint ignore:start */
        issuer_gets: FED,
        currency_gets: RippleBonds.currencyCodes[symbol[0]],
        issuer_pays: issuer,
        currency_pays: symbol
        /* jshint ignore:end */
      };

      var bids = remote.book(optBids);

      bids.offers(function (offers) {
        var newPrice = typeof offers[0] !== 'undefined' ? getPriceFromOffer(offers[0], 'bid') : 0;

        if (newPrice !== bond.b) {
          bond.b = newPrice;
          $rootScope.$apply();
        }
      });

      bids.on('transaction', function () {
        var offers = bids.offersSync();

        var newPrice = typeof offers[0] !== 'undefined' ? getPriceFromOffer(offers[0], 'bid') : 0;

        if (newPrice !== bond.b) {
          bond.b = newPrice;
          $rootScope.$apply();
        }
      });

      // asks

      var optAsks = {
        /* jshint ignore:start */
        issuer_gets: issuer,
        currency_gets: symbol,
        issuer_pays: FED,
        currency_pays: RippleBonds.currencyCodes[symbol[0]]
        /* jshint ignore:end */
      };

      var asks = remote.book(optAsks);

      asks.offers(function (offers) {

        console.log('Asks', offers);

        var newPrice = typeof offers[0] !== 'undefined' ? getPriceFromOffer(offers[0], 'ask') : 0;
        if (newPrice !== bond.a) {
          bond.a = newPrice;
          $rootScope.$apply();
        }
      });

      asks.on('transaction', function () {
        var offers = asks.offersSync();
        console.log('Asks transaction', offers);

        var newPrice = typeof offers[0] !== 'undefined' ? getPriceFromOffer(offers[0], 'ask') : 0;

        if (newPrice !== bond.a) {
          bond.a = newPrice;
          $rootScope.$apply();
        }
      });
    }

    return {
      watchBondPrices: watchBondPrices
    };
  });
