(function () {
  'use strict';

  function buysell(Platform, $rootScope) {
    return {
      templateUrl : 'app/platform/platform.buysell.directive.tpl.html',
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

        $scope.makeOrder = function () {
          var opt = {
            i : $scope.order.i,
            s : $scope.order.s,
            t : Boolean(+$scope.order.t),
            v : +$scope.order.v,
            p : +$scope.order.p
          };

          Platform.makeOrder(opt).then(
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
  }

  angular
    .module('lendbitcoin')
    .directive('buysell', buysell);
})();
