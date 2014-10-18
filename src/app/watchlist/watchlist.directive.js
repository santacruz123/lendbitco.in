(function () {
  'use strict';

  function watchList(Platform, $rootScope) {
    return {
      templateUrl : 'app/watchlist/watchlist.directive.html',
      restrict    : 'E',
      controller  : function ($scope) {
        $rootScope.$on('bond:update', function () {
          $scope.bonds = Platform.getBonds();
          $rootScope.$apply();
        });
      }
    };
  }

  angular
    .module('lendbitcoin')
    .directive('watchlist', watchList);
})();
