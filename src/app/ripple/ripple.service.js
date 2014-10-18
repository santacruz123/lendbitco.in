(function () {
  'use strict';

  function Ripple($window, FED, Account, _, RB, $rootScope) {

    var _isSetSecret;
    var ripple = $window.window.ripple;
    var Remote = ripple.Remote;

    var remote = new Remote({
      /* jshint ignore:start */
      trusted       : true,
      local_signing : true,
      local_fee     : true,
      fee_cushion   : 1.5,
      servers       : [
        {
          host   : 's-east.ripple.com',
          port   : 443,
          secure : true
        },
        {
          host   : 's-west.ripple.com',
          port   : 443,
          secure : true
        }
      ]
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

    this.watchBidAsk = function (obj) {

      var issuer = obj.i;
      var symbol = obj.s;

      var bondOpt = {
        currency : symbol,
        issuer   : issuer
      };

      var currencyOpt = {
        currency : RB.currencyCodes[symbol[0]],
        issuer   : FED
      };

      angular.forEach(['bid', 'ask'], getPricesInit);

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
          issuer_pays   : bondOpt.issuer, // jshint ignore:line
          currency_pays : bondOpt.currency, // jshint ignore:line
          issuer_gets   : currencyOpt.issuer, // jshint ignore:line
          currency_gets : currencyOpt.currency // jshint ignore:line
        } : {
          issuer_pays   : currencyOpt.issuer, // jshint ignore:line
          currency_pays : currencyOpt.currency, // jshint ignore:line
          issuer_gets   : bondOpt.issuer, // jshint ignore:line
          currency_gets : bondOpt.currency // jshint ignore:line
        };

        getBookOffersByType(type);

        var book = remote.book(optBook);
        book.on('transaction', function () {
          getBookOffersByType(type);
        });
      }

      function getBookOffersByType(type) {
        var optBookOffers = type === 'bid' ? {
          gets : currencyOpt,
          pays : bondOpt
        } : {
          gets : bondOpt,
          pays : currencyOpt
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
            i : issuer,
            s : symbol,
            b : +(+newPrice).toFixed(4)
          } : {
            i : issuer,
            s : symbol,
            a : +(+newPrice).toFixed(4)
          };

          $rootScope.$broadcast('bond:price', priceObj);
        };
      }
    };

    this.getBalances = function () {

      /*jshint camelcase: false */
      remote.request_account_lines(Account.acc, function (err, data) {
        if (err) {
          console.log('request_account_lines error - ', err);
          return;
        }

        var symbols = _(data.lines)
          .filter(function (line) {
            return RB.isSymbol(line.currency) ||
              _.indexOf(RB.currencies, line.currency) > -1;
          })
          .map(function (line) {
            return {
              i : line.account,
              s : line.currency,
              v : +(+line.balance).toFixed(3)
            };
          }).value();

        $rootScope.$broadcast('balance:change', symbols);
      });
    };

    this.transaction = function () {
      return remote.transaction();
    };

    this.Amount = ripple.Amount;

    this.updateOrders = function () {
      remote.requestAccountOffers(Account.acc, function (err, data) {

        if (err) {
          console.log('Ripple - updating orders failed', err);
          return;
        }

        var orders = _(data.offers)
          .filter(isRippleBondsOffer)
          .map(function (offer) {
            var order = {};

            /*jshint camelcase: false */
            var g = offer.taker_gets;
            var p = offer.taker_pays;

            // true = buy, false = sell

            order.id = offer.seq;
            order.t = RB.isCurrency(g.currency);
            order.i = order.t ? p.issuer : g.issuer;
            order.s = g.issuer !== FED ? g.currency : p.currency;
            order.p = order.t ? +g.value / +p.value : +p.value / +g.value;
            order.p = +(order.p).toFixed(4);
            order.v = order.t ? +p.value : +g.value;
            order.v = +(order.v).toFixed(4);

            return order;
          }).value();

        console.log('Orders', orders);

        $rootScope.$broadcast('order:change', orders);
      });

      function isRippleBondsOffer(offer) {

        // Detecting if rippleBonds symbols/currencies are there

        var gets, pays;

        /* jshint camelcase: false */
        gets = offer.taker_gets;
        pays = offer.taker_pays;

        return (
          gets.issuer === FED &&
          RB.isCurrency(gets.currency) && RB.isSymbol(pays.currency)
          ) || (
          pays.issuer === FED &&
          RB.isCurrency(pays.currency) && RB.isSymbol(gets.currency)
          );
      }
    };
  }

  angular
    .module('lendbitcoin')
    .service('Ripple', Ripple);
})();
