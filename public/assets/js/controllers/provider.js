(function() {
  'use strict';
  define(['can'], function(can) {
    var Provider;
    return Provider = can.Control.extend({
      init: function(element, options) {
        this.options.provider = new can.Map({
          name: '',
          address: '',
          phoneNumber: ''
        });
        if (this.options.edit !== void 0 && this.options.edit === true) {
          if (can.route.attr('proveedorid') !== void 0) {
            this.getProviderDetails(can.route.attr('proveedorid'));
          }
          return this.element.html(can.view('views/param/param-provider.mustache', {
            provider: this.options.provider,
            edit: this.options.edit
          }));
        } else {
          return this.element.html(can.view('views/param/param-provider.mustache', {
            provider: this.options.provider,
            edit: false
          }));
        }
      },
      '#create-prov click': function(el) {},
      '#delete-prov click': function(el) {},
      '#update-prov click': function(el) {},
      '#cancel-prov click': function(el) {
        this.options.provider.attr('name', '');
        this.options.provider.attr('address', '');
        return this.options.provider.attr('phoneNumber', '');
      },
      getProviderDetails: function(productId) {
        var tempDetails;
        tempDetails = {
          name: 'Bic',
          address: 'Col.Foo, 5ta Bar, Bloque Z',
          phoneNumber: '3333-3333'
        };
        this.options.provider.attr('name', tempDetails.name);
        this.options.provider.attr('address', tempDetails.address);
        return this.options.provider.attr('phoneNumber', tempDetails.phoneNumber);
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
