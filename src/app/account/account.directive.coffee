angular
  .module 'lendbitcoin'
  .directive 'account', (Account, Ripple, $rootScope) ->
    # return
    templateUrl : 'app/account/account.directive.tpl.html',
    restrict    : 'E',
    scope       : {},
    controller  : ($scope) ->
      $scope.$watch 'user.acc', (n, o) ->
        if n != o
          Account.acc = n
          $scope.isSecretSet = false
          $rootScope.$broadcast 'account:change'

      $scope.setSecret = (secret) ->
        Ripple.setSecret secret
        $scope.user.secret = ''
        $scope.isSecretSet = true

      $scope.user =
        acc : Account.acc

      return
