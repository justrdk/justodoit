(function() {
  'use strict';
  define(['can'], function(can) {
    var ProviderModel;
    return ProviderModel = can.Model.extend({
      findOne: 'GET /libuniversal/provider/read/{_id}',
      findAll: 'GET /libuniversal/provider/list',
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
