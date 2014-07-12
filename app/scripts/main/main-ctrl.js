'use strict';

angular.module('gulpangular')
  .controller('MainCtrl', function ($scope, $filter, $window, Bonds) {

    $scope.rb = $window.window.RippleBonds;
    $scope.bonds = Bonds.bonds;

    $scope.predicate = 'b';
    $scope.reverse = false;

    $scope.filter = {
      //i: 'x124'
    };

  });
