(function() {
  'use strict';
  define(['can'], function(can) {
    var ISV;
    return ISV = can.Control.extend({
      init: function(element, options) {
        this.initControllerOptions();
        return this.renderFormView();
      },
      initControllerOptions: function() {
        return this.options.isv = can.compute(0);
      },
      renderFormView: function() {
        return this.element.html(can.view('views/param/param-isv-edit.mustache', {
          isv: this.options.isv
        }));
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
