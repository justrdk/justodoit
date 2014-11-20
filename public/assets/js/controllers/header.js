(function() {
  'use strict';
  define(['can'], function(can) {
    var Header;
    Header = can.Control.extend({
      init: function(element, options) {}
    });
    return {
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    };
  });

}).call(this);
