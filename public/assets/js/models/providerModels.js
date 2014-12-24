(function() {
  'use strict';
  define(['can'], function(can) {
    var ProviderModel;
    return ProviderModel = can.Model.extend({
      id: 'id',
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
