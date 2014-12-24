(function() {
  'use strict';
  define(['can', 'models/providerModels'], function(can, ProviderModel) {
    var Provider;
    return Provider = can.Control.extend({
      init: function(element, options) {
        this.initControllerOptions();
        if (this.options.edit !== void 0 && this.options.edit === true) {
          return this.renderEditTemplate();
        } else {
          return this.renderCreateTemplate();
        }
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
      '.typeahead typeahead:autocompleted': function(el, ev, obj, dataset) {
        el.typeahead('close');
        return this.getProviderDetails(obj._id);
      },
      '.typeahead typeahead:selected': function(el, ev, obj, dataset) {
        return this.getProviderDetails(obj._id);
      },
      initControllerOptions: function() {
        this.options.providersList = new can.List([]);
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
      renderCreateTemplate: function() {
        return this.element.html(can.view('views/param/param-provider.mustache', {
          provider: this.options.provider
        }));
      },
      renderEditTemplate: function() {
        var self;
        self = this;
        return can.when(this.getAllProviders()).then(function() {
          if (can.route.attr('proveedorid') !== void 0) {
            self.getProviderDetails(can.route.attr('proveedorid'));
          }
          self.element.html(can.view('views/param/param-provider-edit.mustache', {
            provider: self.options.providerEdit
          }));
          return self.initSearchAutoComplete();
        });
      },
      initSearchAutoComplete: function() {
        var self;
        self = this;
        return can.$('.typeahead').typeahead({
          hint: true,
          highlight: true
        }, {
          name: 'Proveedores',
          displayKey: 'value',
          source: self.filterProviders(self.options.providersList)
        });
      },
      filterProviders: function(providers) {
        var findMatches;
        return findMatches = function(q, cb) {
          var matches, substrRegex;
          matches = [];
          substrRegex = new RegExp(q, 'i');
          providers.forEach(function(provider, index) {
            if (substrRegex.test(provider.name) === true) {
              return matches.push({
                value: provider.name,
                _id: provider._id
              });
            }
          });
          return cb(matches);
        };
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
            self.options.providerEdit.attr('_id', response.data._id);
            self.options.providerEdit.attr('name', response.data.name);
            self.options.providerEdit.attr('address', response.data.address);
            self.options.providerEdit.attr('phoneNumber', response.data.phoneNumber);
            return self.options.providerEdit.attr('contact', response.data.contact);
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al traer detalles de proveedor, favor intentar de nuevo');
        });
      },
      destroy: function() {
        can.$('typeahead').typeahead('destroy');
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
