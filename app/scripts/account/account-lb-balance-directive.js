'use strict';

angular.module('lendbitcoin')
  .directive('lbBalance', function (Platform, $rootScope) {
    return {
      templateUrl: 'partials/account/account-lb-balance-directive.html',
      restrict: 'E',
      controller: function ($scope) {
        Platform.updateBalances(function () {
          $scope.balances = Platform.getBalances();
          $scope.$emit('balance:update', {});
          $rootScope.$digest();
        });
      }
    };
  });
