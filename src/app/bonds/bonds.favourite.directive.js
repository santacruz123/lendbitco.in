'use strict';

angular.module('lendbitcoin')
  .directive('bondFav', function (Account, _) {
    return {
      template   : '<a ng-click="toggleFav()">{{isFav}}</a>',
      restrict   : 'E',
      scope      : {
        bond : '='
      },
      controller : function ($scope) {
        var bonds = Account.getFavBonds();
        var cleanBond = _.pick($scope.bond, ['i', 's']);
        $scope.isFav = Boolean(_.find(bonds, cleanBond));
        $scope.toggleFav = function () {
          if ($scope.isFav) {
            Account.removeFavBond(cleanBond);
          } else {
            Account.addFavBond(cleanBond);
          }

          $scope.isFav = !$scope.isFav;
        };
      }
    };
  });
