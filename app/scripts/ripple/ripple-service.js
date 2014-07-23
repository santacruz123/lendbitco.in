'use strict';

angular.module('gulpangular')
  .service('Ripple', function ($window, FED, Account, _, RB) {

    var _isSetSecret;
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

    this.setSecret = function (secret) {
      remote.set_secret(Account.acc, secret); // jshint ignore:line
      _isSetSecret = true;
    };

    this.isSecretSet = function () {
      return _isSetSecret;
    };

    this.watchBidAsk = function (issuer, symbol, cb) {

      var bondOpt = {
        currency: symbol,
        issuer: issuer
      };

      var currencyOpt = {
        currency: rippleBonds.currencyCodes[symbol[0]],
        issuer: FED
      };

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
          if (err) {
            return;
          }

          var newPrice = typeof data.offers[0] !== 'undefined' ?
            getPriceFromOffer(data.offers[0], type) : 0;

          var priceObj = type === 'bid' ? {
            b: +(+newPrice).toFixed(4)
          } : {
            a: +(+newPrice).toFixed(4)
          };

          cb(null, priceObj);
        };
      }

      angular.forEach(['bid', 'ask'], getPricesInit);
    };


    this.getBalances = function (cb) {
      remote.request_account_lines(Account.acc, function (err, data) { // jshint ignore:line
        if (err) {
          return cb(err);
        }

        var symbols = _(data.lines)
          .filter(function (line) {
            return RB.isValidSymbol(line.currency) ||
              _.indexOf(RB.currencies, line.currency) > -1;
          })
          .map(function (line) {
            return {
              i: line.account,
              s: line.currency,
              v: +(+line.balance).toFixed(3)
            };
          }).value();

        cb(null, symbols);
      });
    };

    this.transaction = function () {
      return remote.transaction();
    };

    this.Amount = ripple.Amount;

    this.updateOrders = function (cb) {

      remote.requestAccountOffers(Account.acc, function (err, data) {

        if (err) {
          return cb(err);
        }

        function isRippleBondsOffer(offer) { // jshint ignore:line

          // Detecting if rippleBonds symbols/currencies are there

          /* jshint ignore:start */

          var isExchangeCurrency =
            (_.contains(rippleBonds.currencies, offer.taker_gets.currency) &&
              offer.taker_gets.issuer === FED) ||
            (_.contains(rippleBonds.currencies, offer.taker_pays.currency) &&
              offer.taker_pays.issuer === FED);

          var isBond =
            (rippleBonds.isValidSymbol(offer.taker_gets.currency) &&
              offer.taker_gets.issuer !== FED) ||
            (rippleBonds.isValidSymbol(offer.taker_pays.currency) &&
              offer.taker_pays.issuer !== FED);

          /* jshint ignore:end */

          return isExchangeCurrency && isBond; // jshint ignore:line
        }

        var orders = _(data.offers)
          .filter(isRippleBondsOffer)
          .map(function (offer) {
            var order = {};

            var g = offer.taker_gets; // jshint ignore:line
            var p = offer.taker_pays; // jshint ignore:line

            // true = buy, false = sell

            order.id = offer.seq;
            order.t = _.contains(rippleBonds.currencies, g.currency);
            order.i = order.t ? p.issuer : g.issuer;
            order.s = g.issuer !== FED ? g.currency : p.currency;
            order.p = order.t ? +g.value / +p.value : +p.value / +g.value;
            order.p = +(order.p).toFixed(4);
            order.v = order.t ? +p.value : +g.value;
            order.v = +(order.v).toFixed(4);

            return order;
          }).value();

        cb(null, orders);
      });
    };

  });
