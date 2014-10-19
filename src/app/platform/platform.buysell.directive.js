(function () {
  'use strict';

  function buysell(Platform, $rootScope) {
    return {
      templateUrl : 'app/platform/platform.buysell.directive.html',
      restrict    : 'E',
      scope       : false,
      controller  : function ($scope) {
        $scope.$watch('preset', function (obj) {
          $scope.order = angular.copy(obj);
          $scope.order.t = String($scope.order.t);
        }, true);

        $rootScope.$on('bond:new', function () {
          $scope.issuers = Platform.getIssuers();
        });

        $scope.makeOrder = function (order) {
          var opt = {
            i : order.i,
            s : order.s,
            t : Boolean(order.t),
            v : +order.v,
            p : +order.p
          };

          Platform.makeOrder(opt, function (err) {
            if (err) {
              console.log('Platform.makeOrder - fail', err);
            }
          });
        };
      }
    };
  }

  angular
    .module('lendbitcoin')
    .directive('buysell', buysell);
})();
