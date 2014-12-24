(function() {
  'use strict';
  define(['can'], function(can) {
    var ProviderModel;
    return ProviderModel = can.Model.extend({
      findOne: 'GET /libuniversal/provider/read/{_id}',
      findAll: 'GET /libuniversal/provider/list',
      update: function(params) {
        return $.ajax({
          url: '/libuniversal/provider/update',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      },
      create: function(params) {
        return $.ajax({
          url: '/libuniversal/provider/create',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      }
    }, {});
  });

}).call(this);
