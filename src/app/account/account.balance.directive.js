'use strict';

angular.module('lendbitcoin')
  .directive('accountBalance', function (Platform, $rootScope) {
    return {
      templateUrl : 'app/account/account.balance.directive.html',
      restrict    : 'E',
      controller  : function ($scope) {
        Platform.updateBalances(function () {
          $scope.balances = Platform.getBalances();
          $scope.$emit('balance:update', {});
          $rootScope.$digest();
        });
      }
    };
  });
