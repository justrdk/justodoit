(function() {
  'use strict';
  define(['can'], function(can) {
    var ISVModel;
    return ISVModel = can.Model.extend({
      findOne: 'GET /getISV',
      update: function(params) {
        return $.ajax({
          url: '/updateISV',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      }
    }, {});
  });

}).call(this);
