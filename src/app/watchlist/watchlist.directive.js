(function () {
  'use strict';

  function watchList(Platform, $rootScope) {
    return {
      templateUrl : 'app/watchlist/watchlist.directive.html',
      restrict    : 'E',
      controller  : function ($scope) {
        $rootScope.$on('bond:update', updateBonds);
        $rootScope.$on('bond:new', updateBonds);

        function updateBonds() {
          $scope.bonds = Platform.getBonds();
          $rootScope.$apply();
        }
      }
    };
  }

  angular
    .module('lendbitcoin')
    .directive('watchlist', watchList);
})();
