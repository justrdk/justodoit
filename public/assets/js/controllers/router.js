(function() {
  'use strict';
  require(['bootstrap'], function(bootstrap) {
    var Router;
    Router = can.Control.extend({
      init: function(element, options) {},
      'route': function(data) {
        return can.route.attr({
          page: 'home'
        });
      },
      'home route': function(data) {},
      'destroyControllers': function() {
        var controller, currentControllers, _i, _len, _results;
        currentControllers = can.$('.main-container').data().controls;
        _results = [];
        for (_i = 0, _len = currentControllers.length; _i < _len; _i++) {
          controller = currentControllers[_i];
          _results.push(this.destroyController(controller));
        }
        return _results;
      },
      'destroyController': function(controller) {
        if (controller != null) {
          return controller.destroy();
        }
      }
    });
    return $(document).ready(function() {
      return can.route.ready();
    });
  });

}).call(this);
