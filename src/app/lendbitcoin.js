'use strict';

angular.module('lendbitcoin', ['ngCookies', 'ui.router', 'percentage', 'xeditable'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      }).state('address', {
        url: '/{address:r[\\w]{33}}',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  });

angular.module('lendbitcoin')
  .service('_', function ($window) {
    return $window.window._;
  });

angular.module('lendbitcoin')
  .service('RB', function ($window) {
    return $window.window.rippleBonds;
  });

angular.module('lendbitcoin')
  .service('rootScopeApply', function (_, $rootScope) {
    this.apply = _.throttle($rootScope.$apply, 1000);
  });
