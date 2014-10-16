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
          console.log($scope.bonds);
        });
      }
    };
  }

  angular
    .module('lendbitcoin')
    .directive('watchlist', watchList);
})();
