'use strict';

angular.module('lendbitcoin')
  .directive('balance', function (Platform, $rootScope) {
    return {
      templateUrl: 'partials/account/dir-balance.html',
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
