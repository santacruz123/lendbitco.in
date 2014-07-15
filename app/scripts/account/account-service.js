'use strict';

angular.module('gulpangular')
  .service('Account', function ($cookieStore, Ripple, FED, $window, $rootScope) {

    var rippleBonds = $window.window.rippleBonds;

    var orders = [],
      balances = {};

    var remote = Ripple.remote();

    var accFromCookie = $cookieStore.get('acc');

    if (!accFromCookie) {
      var accFromPrompt = prompt('Your Ripple account', accFromCookie);
      accFromCookie = accFromPrompt.match(/r[\w]{33}/);
      $cookieStore.put('acc', accFromCookie);
    }

    // var secretFromPrompt = prompt('Secret key for ' + accFromCookie);

    // Ripple.setSecret(accFromCookie, secretFromPrompt);

    function updateBalances() {

      remote.request_account_lines(accFromCookie, function (err, data) { // jshint ignore:line
        if (err) {
          console.log('remote error - updateBalance');
          return;
        }

        var lines = data.lines;
        var numAccLines = lines.length;

        if (!numAccLines) {
          console.log('No account balance lines');
          return;
        }

        var applyScope;

        for (var i = 0; i < numAccLines; i++) {
          if (lines[i].account !== FED) {
            continue;
          }

          if (rippleBonds.currencies.indexOf(lines[i].currency) === -1) {
            continue;
          }

          var balance = +(+lines[i].balance).toFixed(3);

          if (typeof balances[lines[i].currency] === 'undefined') {
            balances[lines[i].currency] = {
              balance: balance
            };
            applyScope = true;
          } else {
            if (balances[lines[i].currency] !== balance) {
              balances[lines[i].currency] = balance;
              applyScope = true;
            }
          }
        }

        if (applyScope) {
          $rootScope.$apply();
        }

        console.log('Balances:', balances);
      });

      return balances;
    }

    return {
      getAcc: function () {
        return accFromCookie;
      },
      updateBalances: updateBalances
    };

  });
