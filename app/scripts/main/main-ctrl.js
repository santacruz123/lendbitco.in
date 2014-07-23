'use strict';

angular.module('gulpangular')
  .controller('MainCtrl', function ($scope, $filter, RB, Account, Platform, Orders, $rootScope) {

    // Definitions

    $scope.rb = RB;

    var reloadCb = $scope.reloadCb = function () {
      $scope.balances = Platform.getBalances();
      $scope.bonds = Platform.getBonds();
      $scope.positions = Platform.getPositions();
      $scope.orders = Orders.getOrders();
      $rootScope.$apply();
    };

    // Init

    Platform.updateBalances(reloadCb);
    Orders.updateOrders(reloadCb);
    $scope.preset = {};

    // $scope.predicate = 'b';
    // $scope.reverse = false;
    // $scope.filter = {};

  });
