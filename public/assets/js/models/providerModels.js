(function() {
  'use strict';
  define(['can'], function(can) {
    var ProviderModel;
    return ProviderModel = can.Model.extend({
      findOne: 'GET getProvider/{_id}',
      findAll: 'GET getProviders',
      destroy: function(params) {
        return $.ajax({
          url: '/deleteProvider',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      },
      update: function(params) {
        return $.ajax({
          url: '/updateProvider',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      },
      create: function(params) {
        return $.ajax({
          url: '/createProvider',
          type: 'post',
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(params)
        });
      }
    }, {});
  });

}).call(this);
