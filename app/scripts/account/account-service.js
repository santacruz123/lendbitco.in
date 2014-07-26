'use strict';

angular.module('gulpangular')
  .service('Account', function ($cookieStore, _) {

    // Account
    var acc = '';

    this.__defineGetter__('acc', function () {
      return acc || $cookieStore.get('acc');
    });

    this.__defineSetter__('acc', function (val) {
      var regexp = val.match(/r[\w]{33}/);
      if (regexp[0]) {
        acc = regexp[0];
        $cookieStore.put('acc', acc);
        return true;
      } else {
        return false;
      }
    });

    // Account END

    // AddressBook

    this.addIssuer = function (issuer, nickname) {
      var ab = $cookieStore.get('AddressBook');

      if (_.isUndefined()) {
        ab = {};
      }

      ab[issuer] = nickname;
      $cookieStore.put('AddressBook', ab);
    };

    this.removeIssuer = function (issuer) {
      var ab = $cookieStore.get('AddressBook');
      delete ab[issuer];
      $cookieStore.put('AddressBook', ab);
    };

    this.getAddressBook = function () {
      return $cookieStore.get('AddressBook');
    };

    this.addFavBond = function (bond) {
      var favs = $cookieStore.get('Favs');

      if (!favs) {
        favs = {
          bonds: []
        };
      }

      var cleanBond = _.pick(bond, ['i', 's']);

      if (!_.find(favs.bonds, cleanBond)) {
        favs.bonds.push(cleanBond);
      }

      $cookieStore.put('Favs', favs);
    };

    this.removeFavBond = function (bond) {
      var favs = $cookieStore.get('Favs');
      favs.bonds = _.remove(favs.bonds, _.pick(bond, ['i', 's']));
      $cookieStore.put('Favs', favs);
    };

    this.getFavBonds = function () {
      var favs = $cookieStore.get('Favs');

      if (!favs) {
        return [];
      } else {
        return favs.bonds;
      }
    };

  });
