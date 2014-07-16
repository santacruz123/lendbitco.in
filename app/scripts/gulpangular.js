'use strict';

//TODO: REFACTOR EVERYTHING IN LODASH
//TODO: REFACTOR IssuerSymbol with CB (call it Platform-service)

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
