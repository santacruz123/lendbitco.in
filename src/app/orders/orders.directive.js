'use strict';

angular.module('lendbitcoin')
  .directive('orders', function (Platform, $rootScope) {
    return {
      templateUrl : 'app/orders/orders.directive.html',
      restrict    : 'E',
      controller  : function ($scope) {

        $rootScope.$on('order:update', function () {
          $scope.bonds = Platform.getOrders();
          $rootScope.$apply();
        });


        Platform.updateOrders();




        $scope.cancelOrder = Platform.cancelOrder;
      }
    };
  });
