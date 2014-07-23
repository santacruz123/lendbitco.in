'use strict';

angular.module('gulpangular')
  .directive('orders', function (Orders) {
    return {
      templateUrl: 'scripts/orders/orders-directive.html',
      restrict: 'E',
      controller: function ($scope) {
        $scope.cancelOrder = function (id) {
          Orders.cancelOrder(id, $scope.cb());
        };
      }
    };
  });
