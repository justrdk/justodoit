(function() {
  'use strict';
  define(['can'], function(can) {
    var ProductModel;
    return ProductModel = can.Model.extend({
      id: 'id',
      findAll: 'GET /libuniversal/product/list',
      create: function(params) {
        return $.ajax({
          url: '/libuniversal/product/create',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      }
    }, {});
  });

}).call(this);
