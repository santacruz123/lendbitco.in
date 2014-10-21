(function () {
  'use strict';

  function Platform(FED, Account, Ripple, _, RB, $rootScope, $q) {

    var self = this;
    var arr = [];
    var orders = [];

    $rootScope.$on('bond:price', processPrice);
    $rootScope.$on('order:change', processOrders);
    $rootScope.$on('balance:change', processBalance);
    $rootScope.$on('account:change', function () {
      arr = [];
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

    function removeOrder(id) {
      processOrders(null, _.reject(orders, {id : id}));
    }

    this.addSymbol = updateSymbol;

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

    this.makeOrder = function (order) {

      var deferred = $q.defer();

      if (!Ripple.isSecretSet()) {
        console.error('Set secret');
        return $q.reject(new Error('Set secret'));
      }

      var tran = Ripple.transaction(),
          curr = RB.currencyCodes[order.s[0]],
          amtCurrency = (order.v * order.p).toFixed(4) + '/' + curr + '/' + FED,
          amtSymbol = (order.v).toFixed(4) + '/' + order.s + '/' + order.i;

      var tObj = order.t ? {
        from       : Account.acc,
        expiration : order.e,
        flag       : order.f,
        buy        : amtSymbol,
        sell       : amtCurrency
      } : {
        from       : Account.acc,
        expiration : order.e,
        flag       : order.f,
        buy        : amtCurrency,
        sell       : amtSymbol
      };

      tran.offerCreate(tObj);

      tran.submit(function (err, res) {
        if (err) {
          return deferred.reject(err);
        }

        /* jshint camelcase:false */
        if (res.engine_result !== 'tesSUCCESS') {
          return deferred.reject(res);
        }

        self.updateOrders();
        console.log('makeOrder', res.tx_json.Sequence);
        return deferred.resolve(res.tx_json.Sequence);
      });

      return deferred.promise;
    };

    this.cancelOrders = function (opt) {
      return $q.all(_(orders).filter(opt).pluck('id').value().map(self.cancelOrder));
    };

    this.cancelOrder = function (id) {

      if (!id){
        return $q.reject(new Error('cancelOrder - missing order id'));
      }

      console.log('Cancelling order', id);

      var deferred = $q.defer();

      if (!Ripple.isSecretSet()) {
        console.error('Set secret');
        return $q.reject(new Error('Set secret'));
      }

      var tran = Ripple.transaction().offerCancel(Account.acc, id);

      tran.submit(function (err, res) {
        if (err) {
          return deferred.reject(err);
        }

        /* jshint camelcase:false */
        if (res.engine_result !== 'tesSUCCESS') {
          return deferred.reject(res);
        }

        removeOrder(id);
        console.log('cancelOrder', id);
        return deferred.resolve(id);
      });

      return deferred.promise;
    };
  }

  angular
    .module('lendbitcoin')
    .service('Platform', Platform);
})
();
