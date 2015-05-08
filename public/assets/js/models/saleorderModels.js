(function() {
  'use strict';
  define(['can'], function(can) {
    var SaleOrderModel;
    return SaleOrderModel = can.Model.extend({
      findAll: 'GET /getSalesOrder',
      create: function(params) {
        return $.ajax({
          url: '/createSalesOrder',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      }
    }, {});
  });

}).call(this);
