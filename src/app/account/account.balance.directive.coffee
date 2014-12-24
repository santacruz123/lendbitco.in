angular
.module 'lendbitcoin'
.directive 'accountBalance', (Platform, $rootScope) ->
  templateUrl: 'app/account/account.balance.directive.tpl.html',
  restrict   : 'E',
  controller : ($scope) ->
    Platform.updateBalances()
    $rootScope.$on 'balance:update', () ->
      $scope.balances = Platform.getBalances()
      $rootScope.$apply()
