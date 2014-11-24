(function() {
  'use strict';
  define(['can', 'components/headerComponents'], function(can, headerComponent) {
    var Header;
    return Header = can.Control.extend({
      init: function(element, options) {
        return this.element.html(can.view('views/shared/header.mustache'));
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
