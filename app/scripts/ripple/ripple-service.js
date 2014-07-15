'use strict';

angular.module('gulpangular')
  .service('Ripple', function ($window, FED, Account) {

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

    this.watchBidAsk = function (issuer, symbol) {

      var self = this;

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

          self.setPrice(issuer, symbol, type, newPrice);
        };
      }

      angular.forEach(['bid', 'ask'], getPricesInit);
    };


    this.updateBalances = function (cb) {

      var self = this;

      remote.request_account_lines(Account.acc, function (err, data) { // jshint ignore:line
        if (err) {
          return cb(err);
        }

        var lines = data.lines;
        var numAccLines = lines.length;

        if (!numAccLines) {
          return cb(null, false);
        }

        for (var i = 0; i < numAccLines; i++) {

          // Shortcuts

          var issuer = lines[i].account;
          var symbol = lines[i].currency;
          var balance = +(+lines[i].balance).toFixed(3);

          self.setBalance(issuer, symbol, balance);
        }

        cb(null);
      });
    };

  });
