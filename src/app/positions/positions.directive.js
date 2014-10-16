'use strict';

angular.module('lendbitcoin')
  .directive('positions', function () {
    return {
      templateUrl: 'app/positions/positions.directive.html',
      restrict: 'E',
      controller: function () {}
    };
  });
