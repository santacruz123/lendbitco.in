'use strict';

angular.module('gulpangular')
  .service('Ripple', function ($window, FED) {

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

    function watchBondPrices(issuer, symbol, bond) {

      // bids
      var optBids = {
        /* jshint ignore:start */
        issuer_gets: issuer,
        currency_gets: symbol,
        issuer_pays: FED,
        currency_pays: RippleBonds.currencyCodes[symbol[0]]
        /* jshint ignore:end */
      };

      console.log('bids', optBids);

      var bids = remote.book(optBids);

      bids.offers(function (data) {
        bond.b = getPriceFromOffer(data.shift());
        console.log('Set bid price - ' + bond.b);
      });

      bids.on('transaction', function () {
        bond.b = getPriceFromOffer(bids.offersSync().shift());
        console.log('Set bid price after new transaction - ' + bond.b);
      });

      // asks

      var optAsks = {
        /* jshint ignore:start */
        issuer_gets: FED,
        currency_gets: RippleBonds.currencyCodes[symbol[0]],
        issuer_pays: issuer,
        currency_pays: symbol
        /* jshint ignore:end */
      };

      console.log('asks', optAsks);

      var asks = remote.book(optAsks);

      asks.offers(function (data) {
        bond.a = getPriceFromOffer(data.shift());
        console.log('Set ask price - ' + bond.a);
      });

      asks.on('transaction', function () {
        bond.a = getPriceFromOffer(asks.offersSync().shift());
        console.log('Set ask price after new transaction - ' + bond.a);
      });
    }

    return {
      watchBondPrices: watchBondPrices
    };
  });
