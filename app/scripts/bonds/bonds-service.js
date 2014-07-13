'use strict';

angular.module('gulpangular')
  .service('Bonds', function (Ripple) {

    console.log(Ripple);

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
          b: 0,
          a: 0
        });

        index--;
      }

      Bonds.bondIndex[issuer][symbol] = index;

      Ripple.watchBondPrices(issuer, symbol, Bonds.bonds[index]);

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
