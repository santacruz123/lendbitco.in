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

    this.bonds = [{
      i: 'rMaQ3eEFJURCfEc7GZEUVFWnRmE2Y1Au1K',
      s: 'UFF'
    }];

    // var secretFromPrompt = prompt('Secret key for ' + accFromCookie);

    // Ripple.setSecret(accFromCookie, secretFromPrompt);

  });
