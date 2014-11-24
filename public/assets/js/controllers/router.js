(function() {
  'use strict';
  require(['bootstrap', 'can', 'controllers/header', 'controllers/product'], function(bootstrap, can, Header, Product) {
    var Router;
    Router = can.Control.extend({
      init: function(element, options) {
        return new Header(can.$('.top-menu'));
      },
      'route': function(data) {
        return window.location.hash = '#!crearProducto';
      },
      'crearProducto route': function(data) {
        this.destroyControllers;
        return new Product(can.$('.main-container'), {
          edit: false
        });
      },
      'editarProducto route': function(data) {
        this.destroyControllers;
        console.log('dafuq');
        return new Product(can.$('.main-container'), {
          edit: true
        });
      },
      'editarProducto/:productoid route': function(data) {
        this.destroyControllers;
        return new Product(can.$('.main-container'), {
          edit: true
        });
      },
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
