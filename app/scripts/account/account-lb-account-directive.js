'use strict';

angular.module('lendbitcoin')
  .directive('account', function (Account, Ripple) {
    return {
      templateUrl: 'partials/account/account-lb-account-directive.html',
      restrict: 'E',
      scope: {},
      controller: function ($scope) {
        $scope.setSecret = function (secret) {
          Ripple.setSecret(secret);
          $scope.isSecretSet = true;
        };

        $scope.acc = Account.acc;
      }
    };
  });
