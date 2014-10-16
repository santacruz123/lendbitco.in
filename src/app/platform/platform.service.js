(function () {
  'use strict';

  function Platform(FED, Account, Ripple, _, RB, $rootScope) {

    var arr = [];

    $rootScope.$on('bond:price', processPrice);
    $rootScope.$on('balance:change', processBalance);

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

    angular.forEach(RB.currencies, function (currencyCode) {
      updateSymbol({i : FED, s : currencyCode});
    });

    angular.forEach(Account.getFavBonds(), updateSymbol);
  }

  angular
    .module('lendbitcoin')
    .service('Platform', Platform);
})
();
