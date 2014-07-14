'use strict';

angular.module('gulpangular')
  .service('Bonds', function (Ripple, $window, $rootScope) {

    var RippleBonds = $window.window.RippleBonds;

    function Bonds() {}

    Bonds.bonds = [];
    Bonds.bondIndex = {};

    Bonds.addBond = function (issuer, symbol) {

      if (typeof Bonds.bondIndex[issuer] === 'undefined') {
        Bonds.bondIndex[issuer] = {};
      }

      var index;

      if (typeof Bonds.bondIndex[issuer][symbol] !== 'undefined') {
        return Bonds.bondIndex[issuer][symbol];
      } else {
        index = Bonds.bonds.push({
          i: issuer,
          s: symbol,
          e: RippleBonds.getExpDate(symbol),
          b: 0,
          a: 0
        });

        index--;
      }

      Bonds.bondIndex[issuer][symbol] = index;

      Ripple.watchBondPrices(issuer, symbol, function (bid, ask) {
        if (bid !== null) {
          if (bid !== Bonds.bonds[index].b) {
            Bonds.bonds[index].b = bid;
            $rootScope.$apply();
          }
        }
        if (ask !== null) {
          if (ask !== Bonds.bonds[index].a) {
            Bonds.bonds[index].a = ask;
            $rootScope.$apply();
          }
        }
      });

      return index;
    };

    Bonds.getBond = function (issuer, symbol) {
      if (typeof Bonds.bondIndex[issuer]) {
        return Bonds.bonds[Bonds.bondIndex[issuer][symbol]];
      } else {
        return undefined;
      }
    };

    Bonds.getBondById = function (id) {
      return Bonds.bonds[id];
    };

    return Bonds;
  });
