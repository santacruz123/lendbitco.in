(function () {
  'use strict';

  function positions(Platform, $rootScope) {
    return {
      templateUrl : 'app/positions/positions.directive.html',
      restrict    : 'E',
      controller  : function ($scope) {
        $rootScope.$on('balance:update', function () {
          $scope.positions = Platform.getPositions();
        });
      }
    };
  }

  angular
    .module('lendbitcoin')
    .directive('positions', positions);
})();
