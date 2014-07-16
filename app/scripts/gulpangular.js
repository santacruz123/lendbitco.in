'use strict';

angular.module('gulpangular', ['ngCookies', 'ui.router', 'percentage'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  });

angular.module('gulpangular')
  .service('_', function ($window) {
    return $window.window._;
  });
