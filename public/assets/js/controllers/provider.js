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
        return this.createProvider();
      },
      '#delete-prov click': function(el) {
        if (this.providerSelected() === true) {
          return this.deleteProvider();
        } else {
          return Helpers.showMessage('warning', 'No hay proveedores seleccionados para borrar!');
        }
      },
      '#update-prov click': function(el) {
        if (this.providerSelected() === true) {
          return this.updateProvider();
        } else {
          return Helpers.showMessage('warning', 'No hay proveedores seleccionados para actualizar!');
        }
      },
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
      cleanMaps: function() {
        this.options.provider.attr('name', '');
        this.options.provider.attr('address', '');
        this.options.provider.attr('phoneNumber', '');
        this.options.provider.attr('contact', '');
        this.options.providerEdit.attr('_id', '');
        this.options.providerEdit.attr('name', '');
        this.options.providerEdit.attr('address', '');
        this.options.providerEdit.attr('phoneNumber', '');
        return this.options.providerEdit.attr('contact', '');
      },
      providerSelected: function() {
        if (this.options.providerEdit._id) {
          return true;
        } else {
          return false;
        }
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
          source: self.filterProviders()
        });
      },
      filterProviders: function() {
        var findMatches, self;
        self = this;
        return findMatches = function(q, cb) {
          var matches, providers, substrRegex;
          matches = [];
          substrRegex = new RegExp(q, 'i');
          providers = self.options.providersList;
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
      updateProviderInList: function() {
        var idToCompare, self;
        self = this;
        idToCompare = self.options.providerEdit._id;
        return this.options.providersList.filter(function(provider) {
          if (provider._id === idToCompare) {
            return provider.attr('name', self.options.providerEdit.name);
          }
        });
      },
      removeProviderInList: function() {
        var index, provider, _i, _len, _ref, _results;
        _ref = this.options.providersList;
        _results = [];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          provider = _ref[index];
          if (provider._id === this.options.providerEdit._id) {
            this.options.providersList.splice(index, 1);
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      createProvider: function() {
        var deferred, self;
        self = this;
        deferred = ProviderModel.create(this.options.provider.serialize());
        return deferred.then(function(response) {
          if (response.success === true) {
            Helpers.showMessage('success', 'Proveedor creado exitosamente');
            return self.cleanMaps();
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al crear proveedor, favor intentar de nuevo');
        });
      },
      updateProvider: function() {
        var deferred, self;
        self = this;
        deferred = ProviderModel.update(this.options.providerEdit.serialize());
        return deferred.then(function(response) {
          if (response.success === true) {
            Helpers.showMessage('success', 'Proveedor actualizado exitosamente');
            self.updateProviderInList();
            return self.cleanMaps();
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al actualizar proveedor, favor intentar de nuevo');
        });
      },
      deleteProvider: function() {
        var deferred, self;
        self = this;
        deferred = ProviderModel.destroy({
          _id: this.options.providerEdit._id
        });
        return deferred.then(function(response) {
          if (response.success === true) {
            Helpers.showMessage('success', 'Proveedor borrado exitosamente');
            self.removeProviderInList();
            return self.cleanMaps();
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al intentar borrar proveedor, favor intentar de nuevo');
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
