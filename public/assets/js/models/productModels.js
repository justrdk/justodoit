(function() {
  'use strict';
  define(['can'], function(can) {
    var ProductModel;
    return ProductModel = can.Model.extend({
      findOne: 'GET /libuniversal/product/read/{_id}',
      findAll: 'GET /libuniversal/product/list',
      destroy: function(params) {
        return $.ajax({
          url: '/libuniversal/product/delete',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      },
      update: function(params) {
        return $.ajax({
          url: '/libuniversal/product/update',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      },
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
