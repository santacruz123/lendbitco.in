angular
.module 'lendbitcoin', ['ngCookies', 'ui.router', 'percentage', 'xeditable']
.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider.state 'home',
    url        : '/',
    templateUrl: 'app/main/main.html',
    controller : 'MainCtrl'
  .state 'address',
    url        : '/{address:r[\\w]{33}}',
    templateUrl: 'app/main/main.html',
    controller : 'MainCtrl'

  $urlRouterProvider.otherwise '/'


angular
.module 'lendbitcoin'
.service '_', ($window) ->
  $window.window._

angular
.module 'lendbitcoin'
.service 'RB', ($window) ->
  $window.window.rippleBonds
