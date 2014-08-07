'use strict';

angular.module('lendbitcoin')
  .directive('orders', function (Orders) {
    return {
      templateUrl: 'partials/orders/orders-directive.html',
      restrict: 'E',
      controller: function ($scope) {
        $scope.cancelOrder = function (id) {
          Orders.cancelOrder(id, function () {
            Orders.updateOrders($scope.reloadCb);
          });
        };
      }
    };
  });
