(function() {
  'use strict';
  define(['can'], function(can, object) {
    var Product;
    return Product = can.Control.extend({
      init: function(element, options) {
        this.options.product = new can.Map({
          code: '',
          name: '',
          quantity: '',
          provider: ''
        });
        this.options.productProviders = new can.List([]);
        this.getProductProviders();
        this.element.html(can.view('views/product/new-product.mustache', {
          product: this.options.product,
          providers: this.options.productProviders
        }));
        return can.$("select").select2({
          dropdownCssClass: 'dropdown-inverse'
        });
      },
      getProductProviders: function() {
        var tempProviders;
        tempProviders = new can.List([
          {
            id: 1,
            name: 'Copan'
          }, {
            id: 2,
            name: 'Bic'
          }
        ]);
        return this.options.productProviders.replace(tempProviders);
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
