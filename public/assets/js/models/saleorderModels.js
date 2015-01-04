(function() {
  'use strict';
  define(['can'], function(can) {
    var SaleOrderModel;
    return SaleOrderModel = can.Model.extend({
      findAll: 'GET /libuniversal/product/list/{filter}',
      create: function(params) {
        return $.ajax({
          url: '/libuniversal/salesOrder/create',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      }
    }, {});
  });

}).call(this);
