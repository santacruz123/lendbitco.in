'use strict';

angular.module('gulpangular')
  .controller('MainCtrl', function ($scope, $filter, $window, IssuerSymbol, Ripple, $rootScope) {

    $scope.rb = $window.window.rippleBonds;

    Ripple.updateBalances.call(IssuerSymbol, function () {
      $scope.balances = IssuerSymbol.getBalances();
      $scope.bonds = IssuerSymbol.getBonds();
      $scope.positions = IssuerSymbol.getPositions();
      $rootScope.$apply();
    });

    $scope.predicate = 'b';
    $scope.reverse = false;
    $scope.filter = {};

  });
