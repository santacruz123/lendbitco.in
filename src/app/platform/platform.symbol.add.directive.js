'use strict';

angular.module('lendbitcoin')
  .directive('platformAddSymbol', function (Platform) {
    return {
      templateUrl : 'app/platform/platform.symbol.add.directive.js',
      restrict    : 'E',
      scope       : false,
      controller  : function ($scope) {
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
