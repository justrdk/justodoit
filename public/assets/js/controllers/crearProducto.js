(function() {
  'use strict';
  define(['can'], function(can) {
    var CrearProducto;
    return CrearProducto = can.Control.extend({
      init: function(element, options) {
        return this.element.html(can.view('views/producto/new-product.mustache'));
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
