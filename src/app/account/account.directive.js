'use strict';

angular.module('lendbitcoin')
  .directive('account', function (Account, Ripple, $rootScope) {
    return {
      templateUrl : 'app/account/account.directive.html',
      restrict    : 'E',
      scope       : {},
      controller  : function ($scope) {
        $scope.$watch('user.acc', function (n, o) {
          if (n !== o) {
            Account.acc = n;
            $scope.isSecretSet = false;
            $rootScope.$broadcast('account:change');
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
