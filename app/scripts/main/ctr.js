'use strict';

angular.module('lendbitcoin')
  .controller('MainCtrl', function ($scope, $filter, $stateParams, RB, Account, Platform, Orders, $rootScope, _) {

    if (!_.isUndefined($stateParams.address)) {
      Account.acc = $stateParams.address;
    }

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

    Platform.reloadCb = reloadCb;

    $scope.issuers = Platform.getIssuers();
    Orders.updateOrders(reloadCb);

    $scope.setOrderTemplate = function (tmpl, bidask) {
      if (!_.isUndefined(tmpl.b)) { // Bond
        tmpl.p = bidask === 'b' ? tmpl.b : tmpl.a;
        tmpl.t = bidask === 'b';
      } else if (!_.isUndefined(tmpl.t)) { // Order

      } else { // Position
        tmpl.t = false;
      }

      $scope.preset = tmpl;
    };

    $scope.preset = {};

    // $scope.predicate = 'b';
    // $scope.reverse = false;
    // $scope.filter = {};

  });
