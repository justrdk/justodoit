(function() {
  'use strict';
  define(['can', 'models/providerModels'], function(can, ProviderModel) {
    var Provider;
    return Provider = can.Control.extend({
      init: function(element, options) {
        this.initControllerOptions();
        return this.renderCorrectTemplate();
      },
      '#create-prov click': function(el) {
        this.createProvider();
        return this.cleanMaps();
      },
      '#delete-prov click': function(el) {},
      '#update-prov click': function(el) {},
      '#cancel-prov click': function(el) {
        return this.cleanMaps();
      },
      initControllerOptions: function() {
        this.options.providersList = new can.List([]);
        this.options.searchFilter = can.compute('');
        this.options.provider = new can.Map({
          name: '',
          address: '',
          phoneNumber: '',
          contact: ''
        });
        return this.options.providerEdit = new can.Map({
          _id: '',
          name: '',
          address: '',
          phoneNumber: '',
          contact: ''
        });
      },
      renderCorrectTemplate: function() {
        if (this.options.edit !== void 0 && this.options.edit === true) {
          if (can.route.attr('proveedorid') !== void 0) {
            this.getProviderDetails(can.route.attr('proveedorid'));
          }
          return this.element.html(can.view('views/param/param-provider-edit.mustache', {
            provider: this.options.providerEdit,
            searchFilter: this.options.searchFilter
          }));
        } else {
          return this.element.html(can.view('views/param/param-provider.mustache', {
            provider: this.options.provider
          }));
        }
      },
      cleanMaps: function() {
        this.options.provider.attr('name', '');
        this.options.provider.attr('address', '');
        this.options.provider.attr('phoneNumber', '');
        this.options.providerEdit.attr('_id', '');
        this.options.providerEdit.attr('name', '');
        this.options.providerEdit.attr('address', '');
        return this.options.providerEdit.attr('phoneNumber', '');
      },
      createProvider: function() {
        var deferred;
        deferred = ProviderModel.create(this.options.provider.serialize());
        return deferred.then(function(response) {
          if (response.success === true) {
            return Helpers.showMessage('success', 'Proveedor creado exitosamente');
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al crear proveedor, favor intentar de nuevo');
        });
      },
      getAllProviders: function() {
        var deferred, self;
        self = this;
        deferred = ProviderModel.findAll({});
        deferred.then(function(response) {
          if (response.success === true) {
            return self.options.providersList.replace(response);
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error consiguiendo lista de proveedores, favor intentar de nuevo');
        });
        return deferred;
      },
      getProviderDetails: function(providerId) {
        var deferred, self;
        self = this;
        deferred = ProviderModel.findOne({
          _id: providerId
        });
        return deferred.then(function(response) {
          if (response.success === true) {
            self.providerEdit.attr('_id', response._id);
            self.providerEdit.attr('name', response.name);
            self.providerEdit.attr('address', response.address);
            self.providerEdit.attr('phoneNumber', response.phoneNumber);
            return self.providerEdit.attr('contact', response.contact);
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al traer detalles de proveedor, favor intentar de nuevo');
        });
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
