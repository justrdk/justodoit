(function() {
  'use strict';
  require(['bootstrap', 'can', 'controllers/header', 'controllers/createProduct'], function(bootstrap, can, Header, Product) {
    var Router;
    Router = can.Control.extend({
      init: function(element, options) {
        return new Header(can.$('.top-menu'));
      },
      'route': function(data) {
        return window.location.hash = '#!venta';
      },
      'crearProducto route': function(data) {
        return new Product(can.$('.main-container'));
      },
      'editarProducto': function(data) {},
      'editarProducto/:productoid': function(data) {},
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
      new Router($('body'));
      return can.route.ready();
    });
  });

}).call(this);
