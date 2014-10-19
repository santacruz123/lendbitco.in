(function () {
  'use strict';

  function accountBalance(Platform, $rootScope) {
    return {
      templateUrl : 'app/account/account.balance.directive.html',
      restrict    : 'E',
      controller  : function ($scope) {
        Platform.updateBalances();
        $rootScope.$on('balance:update', function () {
          $scope.balances = Platform.getBalances();
          $rootScope.$apply();
        });
      }
    };
  }

  angular
    .module('lendbitcoin')
    .directive('accountBalance', accountBalance);
})();
