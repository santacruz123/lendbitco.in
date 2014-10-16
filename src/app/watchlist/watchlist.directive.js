'use strict';

angular.module('lendbitcoin')
  .directive('watchlist', function () {
    return {
      templateUrl : 'app/watchlist/watchlist.directive.html',
      restrict    : 'E',
      controller  : function () {
      }
    };
  });
