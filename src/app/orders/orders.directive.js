'use strict';

angular.module('lendbitcoin')
  .directive('orders', function (Platform, $rootScope) {
    return {
      templateUrl : 'app/orders/orders.directive.tpl.html',
      restrict    : 'E',
      controller  : function ($scope) {
        $rootScope.$on('order:update', function () {
          $scope.orders = Platform.getOrders();
          $rootScope.$apply();
        });

        Platform.updateOrders();

        $scope.cancelOrder = function (orderId) {
          Platform.cancelOrder(orderId).then(
            function (res) {
              console.log('Success', res);
            },
            function (err) {
              console.log('Error', err);
            }
          );
        };
      }
    };
  });
