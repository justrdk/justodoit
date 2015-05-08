(function() {
  'use strict';
  define(['can'], function(can) {
    var ProductModel;
    return ProductModel = can.Model.extend({
      findOne: 'GET /getProduct/{_id}',
      findAll: 'GET /getProducts',
      destroy: function(params) {
        return $.ajax({
          url: '/deleteProduct',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      },
      update: function(params) {
        return $.ajax({
          url: '/updateProduct',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      },
      create: function(params) {
        return $.ajax({
          url: '/createProduct',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      }
    }, {});
  });

}).call(this);
