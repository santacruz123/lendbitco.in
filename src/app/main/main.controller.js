(function () {
  'use strict';

  function MainCtrl($scope, $stateParams, RB, Account, _) {

    if (!_.isUndefined($stateParams.address)) {
      Account.acc = $stateParams.address;
    }

    // Definitions

    $scope.rb = RB;

    // Init

    $scope.setOrderTemplate = function (tmpl, bidask) {
      if (!_.isUndefined(tmpl.b)) { // Bond
        tmpl.p = bidask === 'b' ? tmpl.b : tmpl.a;
        tmpl.t = bidask === 'b';
      } else if (!_.isUndefined(tmpl.t)) { // Order

      } else { // Position
        tmpl.t = false;
      }

      $scope.preset = tmpl;
    };

    $scope.preset = {};

    $scope.predicate = 'b';
    $scope.reverse = false;
    $scope.filter = {};

  }

  angular
    .module('lendbitcoin')
    .controller('MainCtrl', MainCtrl);
})();
