(function () {
  'use strict';

  function Platform(FED, Account, Ripple, _, RB, $rootScope) {

    var self = this;
    var arr = [];
    var orders = [];

    $rootScope.$on('bond:price', processPrice);
    $rootScope.$on('order:change', processOrders);
    $rootScope.$on('balance:change', processBalance);
    $rootScope.$on('account:change', function () {
      Ripple.getBalances();
      Ripple.updateOrders();
    });

    angular.forEach(RB.currencies, function (currencyCode) {
      updateSymbol({i : FED, s : currencyCode});
    });

    angular.forEach(Account.getFavBonds(), updateSymbol);

    // Definitions

    function processOrders(event, newOrders) {
      orders = newOrders;
      $rootScope.$broadcast('order:update');
    }

    function processPrice(event, obj) {
      updateSymbol(obj);
      $rootScope.$broadcast('bond:update');
    }

    function processBalance(event, obj) {
      _(obj).forEach(updateSymbol);
      $rootScope.$broadcast('balance:update');
    }

    function updateSymbol(obj) {
      if (!obj.i || !obj.s || obj.s === 'XRP') {
        console.log('updateSymbol - Invalid symbol supplied', obj);
        return false;
      }

      var index = _.findIndex(arr, function findSymbol(fromArr) {
        return !!(obj.i === fromArr.i && obj.s === fromArr.s);
      });

      if (index !== -1) {
        _.assign(arr[index], obj);
        console.log('Updating', obj);
      } else {

        // New symbol

        var isSymbol = RB.isSymbol(obj.s);
        var isCurrency = RB.isCurrency(obj.s);

        if (!(isSymbol || isCurrency)) {
          console.log('updateSymbol - new - Invalid symbol supplied');
          return;
        }

        var def = {v : 0, b : 0, a : 0};

        if (isSymbol) {
          def.e = RB.getExpDate(obj.s);
          Ripple.watchBidAsk(obj);
        }

        _.defaults(obj, def);
        arr.push(obj);
        $rootScope.$broadcast('bond:new');
      }
    }

    this.getIssuers = function () {
      return _(arr)
        .map('i')
        .uniq()
        .value();
    };

    this.updateBalances = Ripple.getBalances;

    this.updateOrders = Ripple.updateOrders;

    this.getBalances = function () {
      return _(arr)
        .filter(function (symbol) {
          return symbol.i === FED && symbol.v !== 0 && RB.isCurrency(symbol.s);
        })
        .value();
    };

    this.getBonds = function () {
      return _(arr)
        .filter('e')
        .value();
    };

    this.getPositions = function () {
      return _(arr)
        .filter('v')
        .filter('e')
        .value();
    };

    // Orders

    this.getOrders = function () {
      return orders;
    };

    this.makeOrder = function (opt, cb) {

      if (!Ripple.isSecretSet()) {
        return cb('Secret not set');
      }

      var tran = Ripple.transaction();
      var curr = RB.currencyCodes[opt.s[0]];

      var cHuman = (opt.v * opt.p).toFixed(4) + curr;
      var sHuman = (opt.v).toFixed(4) + opt.s;

      /* jshint camelcase:false */
      var cAmt = Ripple.Amount.from_human(cHuman).set_issuer(FED);
      var sAmt = Ripple.Amount.from_human(sHuman).set_issuer(opt.i);

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

        /* jshint camelcase:false */
        if (res.engine_result !== 'tesSUCCESS') {
          return cb(res);
        }

        /* jshint camelcase:false */
        cb(err, res.tx_json.Sequence);

        self.updateOrders();
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
  }

  angular
    .module('lendbitcoin')
    .service('Platform', Platform);
})
();
