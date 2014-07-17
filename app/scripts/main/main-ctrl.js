'use strict';

angular.module('gulpangular')
  .controller('MainCtrl', function ($scope, $filter, RB, Account, Platform, Orders, $rootScope) {

    function reloadCb() {
      $scope.balances = Platform.getBalances();
      $scope.bonds = Platform.getBonds();
      $scope.positions = Platform.getPositions();
      $scope.orders = Orders.getOrders();

      $rootScope.$apply();
    }

    Platform.setReloadCb(reloadCb);

    $scope.rb = RB;

    Platform.updateBalances();
    Orders.updateOrders(reloadCb);

    // $scope.predicate = 'b';
    // $scope.reverse = false;
    // $scope.filter = {};

  });
