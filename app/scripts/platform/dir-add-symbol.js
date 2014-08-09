'use strict';

angular.module('lendbitcoin')
  .directive('platformAddSymbol', function (Platform) {
    return {
      templateUrl: 'partials/platform/dir-add-symbol.html',
      restrict: 'E',
      scope: false,
      controller: function ($scope) {
        $scope.addSymbol = function (symbol, symbolstr) {
          if (symbolstr) {
            var tmp = symbolstr.split(':');
            Platform.addSymbol(tmp[0], tmp[1]);
          } else {
            Platform.addSymbol(symbol.i, symbol.s);
          }
        };
      }
    };
  });
