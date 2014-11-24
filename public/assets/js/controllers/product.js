(function() {
  'use strict';
  define(['can'], function(can) {
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
        if (this.options.edit !== void 0 && this.options.edit === true) {
          if (can.route.attr('productoid') !== void 0) {
            this.getProductDetails(can.route.attr('productoid'));
          }
          this.element.html(can.view('views/product/new-product.mustache', {
            product: this.options.product,
            providers: this.options.productProviders,
            edit: this.options.edit
          }));
        } else {
          this.element.html(can.view('views/product/new-product.mustache', {
            product: this.options.product,
            providers: this.options.productProviders,
            edit: false
          }));
        }
        return can.$("select").select2({
          dropdownCssClass: 'dropdown-inverse'
        });
      },
      getProductDetails: function(productId) {
        var tempDetails;
        tempDetails = {
          id: "1",
          code: 'CUNICO123',
          name: 'Cuaderno Unico Copan, 3 Materias',
          quantity: 10,
          provider: 1
        };
        this.options.product.attr('code', tempDetails.code);
        this.options.product.attr('name', tempDetails.name);
        this.options.product.attr('quantity', tempDetails.quantity);
        return this.options.product.attr('provider', tempDetails.provider);
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
