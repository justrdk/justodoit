(function() {
  'use strict';
  define(['can'], function(can) {
    var ISVModel;
    return ISVModel = can.Model.extend({
      findOne: 'GET /libuniversal/isv/read',
      update: function(params) {
        return $.ajax({
          url: '/libuniversal/isv/update',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      }
    }, {});
  });

}).call(this);
