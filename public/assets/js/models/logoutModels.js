(function() {
  'use strict';
  define(['can'], function(can) {
    var LogOutModel;
    return LogOutModel = can.Model.extend({
      findOne: 'GET /logout'
    }, {});
  });

}).call(this);
