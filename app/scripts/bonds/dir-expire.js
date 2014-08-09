'use strict';

angular.module('lendbitcoin')
  .directive('expire', function () {
    return {
      template: '{{expMonth|date:dtFormat}} ({{daysLeft}} days)',
      restrict: 'E',
      scope: {
        date: '@'
      },
      controller: function ($scope) {
        var expDate = new Date($scope.date.replace(/"/g, ''));
        $scope.expMonth = new Date(expDate.getTime() - 1);
        var now = new Date();
        var nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000);

        $scope.daysLeft = Math.round((expDate.getTime() - nowUTC) / 24 / 60 / 60 / 1000, 1);
        $scope.dtFormat = $scope.daysLeft >= 365 ? 'MMM y' : 'MMM';
      }
    };
  });
