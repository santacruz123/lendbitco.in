'use strict';

angular.module('lendbitcoin')
  .service('Orders', function (Ripple, Account, FED, RB, _) {

    var self = this;
    this.orders = [];

    this.updateOrders = function (cb) {
      Ripple.updateOrders(function (err, orders) {
        if (err) {
          return cb(err);
        }
        self.orders = orders;

        if (cb) {
          cb(null);
        }
      });
    };

    this.getOrders = function (opt) {
      return _(this.orders).filter(opt).value();
    };

    this.makeOrder = function (opt, cb) {

      if (!Ripple.isSecretSet()) {
        return cb('Secret not set');
      }

      var tran = Ripple.transaction();
      var curr = RB.currencyCodes[opt.s[0]];

      var cHuman = (opt.v * opt.p).toFixed(4) + curr;
      var sHuman = (opt.v).toFixed(4) + opt.s;

      var cAmt = Ripple.Amount.from_human(cHuman).set_issuer(FED); // jshint ignore:line
      var sAmt = Ripple.Amount.from_human(sHuman).set_issuer(opt.i); // jshint ignore:line

      var tObj = opt.t ? {
        from       : Account.acc,
        expiration : opt.e,
        flag       : opt.f,
        buy        : sAmt,
        sell       : cAmt
      } : {
        from       : Account.acc,
        expiration : opt.e,
        flag       : opt.f,
        buy        : cAmt,
        sell       : sAmt
      };

      tran.offerCreate(tObj);

      tran.submit(function (err, res) {

        if (!cb) {
          return console.log(err, res);
        }

        if (err) {
          return cb(err);
        }

        if (res.engine_result !== 'tesSUCCESS') { // jshint ignore:line
          return cb(res);
        }

        cb(err, res.tx_json.Sequence); // jshint ignore:line
      });
    };

    this.cancelAllOrders = function (issuer, symbol, type, cb) {
      var args = [];

      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      if (_.isFunc(args[args.length - 1])) {
        cb = args.pop();
      }

      issuer = args.length !== 0 ? args.shift() : null;
      symbol = args.length !== 0 ? args.shift() : null;
      type = args.length !== 0 ? args.shift() : null;

      // Arguments - done

      var opt = {};

      if (_.isObject(issuer)) {
        opt = issuer;
      } else {
        if (issuer) {
          opt.i = issuer;
        }

        if (symbol) {
          opt.s = symbol;
        }

        if (!_.isUndefined(type)) {
          opt.t = type;
        }
      }

//      var orders = this.getOrders();
//      async(
//        _(orders)
//        .map(function (order) {
//          return _.bind(self.cancelOrder, self, order.id);
//        }).value(),
//        function (err, data) {
//          console.log(err, data);
//          console.log('All orders deleted');
//
//          if (cb) {
//            cb();
//          }
//        });
    };

    this.cancelOrder = function (id, cb) {

      if (!Ripple.isSecretSet()) {
        return cb('Secret not set');
      }

      var tran = Ripple.transaction();
      tran.offerCancel(Account.acc, id);

      tran.submit(function (err, res) {

        if (!cb) {
          return console.log(err, res);
        }

        if (err) {
          return cb(err);
        }

        if (res.engine_result !== 'tesSUCCESS') { // jshint ignore:line
          return cb(res);
        }

        cb(null);
      });
    };

  });
