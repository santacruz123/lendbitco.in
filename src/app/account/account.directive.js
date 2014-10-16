'use strict';

angular.module('lendbitcoin')
  .directive('account', function (Account, Ripple) {
    return {
      templateUrl : 'app/account/account.directive.html',
      restrict    : 'E',
      scope       : {},
      controller  : function ($scope) {
        $scope.$watch('user.acc', function (n) {
          if (n) {
            Account.acc = n;
            $scope.isSecretSet = false;
          }
        });

        $scope.setSecret = function (secret) {
          Ripple.setSecret(secret);
          $scope.user.secret = '';
          $scope.isSecretSet = true;
        };

        $scope.user = {
          acc : Account.acc
        };
      }
    };
  });
