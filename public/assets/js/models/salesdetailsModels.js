(function() {
  'use strict';
  define(['can'], function(can) {
    var SalesDetailsModel;
    return SalesDetailsModel = can.Model.extend({
      findAll: function(params) {
        return $.ajax({
          url: '/libuniversal/salesOrder/findByDate',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      }
    }, {});
  });

}).call(this);
