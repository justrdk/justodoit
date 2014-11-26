(function() {
  'use strict';
  require(['bootstrap', 'can', 'controllers/header', 'controllers/product', 'controllers/provider'], function(bootstrap, can, Header, Product, Provider) {
    var Router;
    Router = can.Control.extend({
      init: function(element, options) {
        return new Header(can.$('.top-menu'));
      },
      'route': function(data) {
        return window.location.hash = '#!crearProducto';
      },
      'crearProducto route': function(data) {
        this.destroyControllers();
        return new Product(can.$('.main-container'), {
          edit: false
        });
      },
      'editarProducto route': function(data) {
        this.destroyControllers();
        return new Product(can.$('.main-container'), {
          edit: true
        });
      },
      'editarProducto/:productoid route': function(data) {
        this.destroyControllers();
        return new Product(can.$('.main-container'), {
          edit: true
        });
      },
      'crearProveedor route': function(data) {
        this.destroyControllers();
        return new Provider(can.$('.main-container'), {
          edit: false
        });
      },
      'editarProveedor route': function(data) {
        this.destroyControllers();
        return new Provider(can.$('.main-container'), {
          edit: true
        });
      },
      'editarProveedor/:proveedorid route': function(data) {
        this.destroyControllers();
        return new Provider(can.$('.main-container'), {
          edit: true
        });
      },
      'destroyControllers': function() {
        var controller, currentControllers, _i, _len, _results;
        currentControllers = can.$('.main-container').data().controls;
        if (currentControllers !== void 0) {
          _results = [];
          for (_i = 0, _len = currentControllers.length; _i < _len; _i++) {
            controller = currentControllers[_i];
            _results.push(this.destroyController(controller));
          }
          return _results;
        }
      },
      'destroyController': function(controller) {
        if (controller !== void 0 && controller !== null) {
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
