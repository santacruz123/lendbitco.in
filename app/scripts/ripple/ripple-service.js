'use strict';

angular.module('gulpangular')
  .service('Ripple', function ($window, FED, $rootScope) {

    var ripple = $window.window.ripple;

    // TODO change ripple-bonds to lowercase in lib
    var RippleBonds = $window.window.RippleBonds;

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

    function getPriceFromOffer(offer) {

      // If somebody selling bond for XRP
      //
      // "TakerGets": "6250428327",
      // "TakerPays": {
      //   "currency": "USD",
      //   "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
      //   "value": "26.741141747517"
      // }

      if (typeof offer.TakerGets.issuer === 'undefined') {
        return offer.TakerGets / offer.TakerPays.value / 1000000;
      } else {
        return offer.TakerGets.value / offer.TakerPays.value;
      }
    }

    remote.connect();

    function watchBondPrices(issuer, symbol, bond) {

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

      bids.offers(function (data) {
        bond.b = data.length ? getPriceFromOffer(data.shift()) : 0;
        $rootScope.$apply();
        console.log('Issuer:', bond.i, ' Symbol:', bond.s, 'Bid:', bond.b);
      });

      bids.on('transaction', function () {
        bond.b = bids.offersSync().length ? getPriceFromOffer(bids.offersSync().shift()) : 0;
        $rootScope.$apply();
        console.log('Issuer:', bond.i, ' Symbol:', bond.s, 'Bid:', bond.b);
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

      asks.offers(function (data) {
        bond.a = data.length ? getPriceFromOffer(data.shift()) : 0;
        $rootScope.$apply();
        console.log('Issuer:', bond.i, ' Symbol:', bond.s, 'Ask:', bond.a);
      });

      asks.on('transaction', function () {
        bond.a = asks.offersSync().length ? getPriceFromOffer(asks.offersSync().shift()) : 0;
        $rootScope.$apply();
        console.log('Issuer:', bond.i, ' Symbol:', bond.s, 'Ask:', bond.a);
      });
    }

    return {
      watchBondPrices: watchBondPrices
    };
  });
