'use strict';

angular.module('gulpangular')
  .controller('MainCtrl', function ($scope, $filter, $window, Bonds) {

    $scope.rb = $window.window.RippleBonds;
    $scope.bonds = Bonds.bonds;

    $scope.predicate = 'b';
    $scope.reverse = false;

    Bonds.addBond('rQpCfAsbZFRwH53aoVqzKFcXuq6wnukQCL', 'UFF');
    Bonds.addBond('rMaQ3eEFJURCfEc7GZEUVFWnRmE2Y1Au1K', 'UFF');

    $scope.filter = {
      //i: 'x124'
    };

  });
