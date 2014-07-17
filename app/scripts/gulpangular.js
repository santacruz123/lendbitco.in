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

angular.module('gulpangular')
  .service('RB', function ($window) {
    return $window.window.rippleBonds;
  });

angular.module('gulpangular')
  .service('rootScopeApply', function (_, $rootScope) {
    this.apply = _.throttle($rootScope.$apply, 1000);
  });
