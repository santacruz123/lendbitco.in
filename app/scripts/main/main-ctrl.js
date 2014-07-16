'use strict';

angular.module('gulpangular')
  .controller('MainCtrl', function ($scope, $filter, $window, IssuerSymbol, Ripple, Orders, $rootScope) {

    $scope.rb = $window.window.rippleBonds;

    Ripple.updateBalances.call(IssuerSymbol, function () {
      $scope.balances = IssuerSymbol.getBalances();
      $scope.bonds = IssuerSymbol.getBonds();
      $scope.positions = IssuerSymbol.getPositions();

      $rootScope.$apply();
    });

    Orders.updateOrders(function () {
      $scope.orders = Orders.getOrders({
        s: 'UFF'
      });

      $rootScope.$apply();
    });

    $scope.predicate = 'b';
    $scope.reverse = false;
    $scope.filter = {};

  });
