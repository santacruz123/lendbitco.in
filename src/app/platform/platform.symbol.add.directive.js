(function () {
  'use strict';

  function platformSymbolAdd(Platform) {
    return {
      templateUrl : 'app/platform/platform.symbol.add.directive.tpl.html',
      restrict    : 'E',
      scope       : false,
      controller  : function ($scope) {
        $scope.addSymbol = function () {
          if (angular.isDefined($scope.symbol.str)) {
            var tmp = $scope.symbol.str.split(':');
            Platform.addSymbol({i : tmp[0], s : tmp[1].toUpperCase()});
          } else {
            $scope.symbol.s.toUpperCase();
            Platform.addSymbol($scope.symbol);
          }
        };
      }
    };
  }

  angular
    .module('lendbitcoin')
    .directive('platformSymbolAdd', platformSymbolAdd);
})();
