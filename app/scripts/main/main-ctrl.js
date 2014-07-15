'use strict';

angular.module('gulpangular')
  .controller('MainCtrl', function ($scope, $filter, $window, IssuerSymbol, Ripple, $rootScope) {


    Ripple.updateBalances.call(IssuerSymbol, function () {
      console.log('balaces updated');
      $scope.balances = IssuerSymbol.getBalances();
      $scope.bonds = IssuerSymbol.getBonds();
      $rootScope.$apply();
    });

    $scope.predicate = 'b';
    $scope.reverse = false;
    $scope.filter = {};

  });
