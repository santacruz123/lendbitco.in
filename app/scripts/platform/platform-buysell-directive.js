'use strict';

angular.module('gulpangular')
  .directive('buysell', function (Platform, Orders) {
    return {
      templateUrl: 'partials/platform/platform-buysell-directive.html',
      restrict: 'E',
      scope: false,
      controller: function ($scope) {
        $scope.$watch('preset', function (obj) {
          $scope.order = angular.copy(obj);
          $scope.order.t = String($scope.order.t);
        }, true);

        $scope.makeOrder = function (order) {
          var opt = {
            i: order.i,
            s: order.s,
            t: Boolean(order.t),
            v: +order.v,
            p: +order.p
          };

          Orders.makeOrder(opt, function () {
            Orders.updateOrders($scope.reloadCb);
          });
        };

        $scope.issuers = Platform.getIssuers();
      }
    };
  });
