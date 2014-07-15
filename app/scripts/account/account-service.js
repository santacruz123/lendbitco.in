'use strict';

angular.module('gulpangular')
  .service('Account', function ($cookieStore) {

    this.acc = $cookieStore.get('acc');

    if (!this.acc) {
      var accFromPrompt = prompt('Your Ripple account', this.acc);
      var regexp = accFromPrompt.match(/r[\w]{33}/);
      if (regexp[0]) {
        this.acc = regexp[0];
        console.log(this.acc);
        $cookieStore.put('acc', this.acc);
      }
    }

    // var secretFromPrompt = prompt('Secret key for ' + accFromCookie);

    // Ripple.setSecret(accFromCookie, secretFromPrompt);

  });

angular.module('gulpangular')
  .service('IssuerSymbol', function ($window, FED, Account, Ripple) {

    var self = this;

    var rippleBonds = $window.window.rippleBonds;

    this.arr = [];
    this.arrIndx = {};
    this.bonds = [];

    this.addSymbol = this.getArrIndx = function (issuer, symbol) {

      if (symbol === 'XRP') {
        return;
      }

      if (typeof this.arrIndx[issuer] === 'undefined') {
        this.arrIndx[issuer] = {};
      }

      if (typeof this.arrIndx[issuer][symbol] !== 'undefined') {
        return this.arrIndx[issuer][symbol];
      }

      // Adding symbol

      var isBond = false;

      try {
        rippleBonds.checkSymbol(symbol);
        isBond = true;
      } catch (e) {

      }

      var arrObj = {
        i: issuer,
        s: symbol,
        bal: 0,
        b: 0,
        a: 0
      };

      if (isBond && rippleBonds.currencies.indexOf(symbol) === -1) {
        arrObj.e = rippleBonds.getExpDate(symbol);
      }

      // Pushing and getting Id

      var index = this.arr.push(arrObj);

      index--;

      this.arrIndx[issuer][symbol] = index;

      // Updating bonds array

      if (isBond && rippleBonds.currencies.indexOf(symbol) === -1) {
        Ripple.watchBidAsk.call(this, issuer, symbol);
        this.bonds.push(index);
      }

      return index;
    };

    this.setPrice = function (issuer, symbol, type, price) {

      console.log('Setting ' + type + ' for ' + issuer + ':' + symbol + '  = ' + price);

      if (type === 'bid') {
        this.arr[this.getArrIndx(issuer, symbol)].b = price;
      } else {
        this.arr[this.getArrIndx(issuer, symbol)].a = price;
      }
    };

    this.setBalance = function (issuer, symbol, balance) {
      console.log('Setting balance for ' + issuer + ':' + symbol + '  = ' + balance);

      this.arr[this.getArrIndx(issuer, symbol)].bal = balance;
    };

    this.getBalances = function () {
      var balances = [];
      angular.forEach(this.arr, function (e) {
        if (e.i === FED && e.bal !== 0 &&
          rippleBonds.currencies.indexOf(e.s) !== -1) {
          balances.push({
            s: e.s,
            bal: e.bal
          });
        }
      });

      return balances;
    };

    this.getBonds = function () {
      var self = this;
      var bonds = [];
      angular.forEach(self.bonds, function (id) {
        bonds.push(self.arr[id]);
      });
      return bonds;
    };

    angular.forEach(rippleBonds.currencies, function (e) {
      self.addSymbol(FED, e);
    });

    // angular.forEach(rippleBonds.currencies, function (e) {
    //   self.addSymbol(Account.acc, e);
    // });

  });
