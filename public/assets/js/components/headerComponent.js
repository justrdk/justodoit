(function() {
  'use strict';
  define(['can', 'models/logoutModels'], function(can, LogoutModel) {
    return can.Component.extend({
      tag: 'navbar-element',
      template: can.view('views/shared/header.mustache'),
      scope: {
        company: 'Foo Bar',
        logout: function() {
          var deferred;
          deferred = LogoutModel.findOne();
          return deferred.then(function(response) {
            if (response.success === true) {
              return can.route.attr('route', 'login');
            }
          }, function(xhr) {
            return console.log('error on request');
          });
        }
      }
    });
  });

}).call(this);
