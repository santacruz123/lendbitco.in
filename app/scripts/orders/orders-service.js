'use strict';

angular.module('gulpangular')
  .service('Orders', function (Ripple, _) {

    var self = this;
    this.orders = [];

    this.updateOrders = function (cb) {
      Ripple.updateOrders(function (err, orders) {
        if (err) {
          return cb(err);
        }
        self.orders = orders;

        if (cb) {
          cb(null);
        }
      });
    };

    this.getOrders = function (opt) {
      return _(this.orders).filter(opt).value();
    };

  });
