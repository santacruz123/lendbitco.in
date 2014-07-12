'use strict';

angular.module('gulpangular')
  .service('Bonds', function (Ripple) {

    function Bonds() {}

    Bonds.bonds = [];
    Bonds.bondIndex = {};

    Bonds.addBond = function (issuer, symbol) {
      var index = Bonds.bonds.push({
        i: issuer,
        s: symbol
      });

      if (typeof Bonds.bondIndex[issuer] === 'undefined') {
        Bonds.bondIndex[issuer] = {};
      }

      Bonds.bondIndex[issuer][symbol] = index;

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
