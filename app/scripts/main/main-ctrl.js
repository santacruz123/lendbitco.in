'use strict';

angular.module('gulpangular')
  .controller('MainCtrl', function ($scope, $filter, $window, Bonds) {

    $scope.rb = $window.window.RippleBonds;
    $scope.bonds = Bonds.bonds;

    $scope.predicate = 'b';
    $scope.reverse = false;

    Bonds.addBond('rQpCfAsbZFRwH53aoVqzKFcXuq6wnukQCL', 'UFF');
    Bonds.addBond('rLxW7EemTrcmwFVZJsYtfnnP4rXAb92o4v', 'UFF');

    $scope.filter = {
      //i: 'x124'
    };

  });
