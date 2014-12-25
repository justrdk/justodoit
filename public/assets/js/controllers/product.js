(function() {
  'use strict';
  define(['can', 'models/productModels', 'models/providerModels'], function(can, ProductModel, ProviderModel) {
    var Product;
    return Product = can.Control.extend({
      init: function(element, options) {
        var self;
        self = this;
        this.initControllerOptions();
        return can.when(this.getProductProviders()).then(function(response) {
          if (self.options.edit !== void 0 && self.options.edit === true) {
            return self.renderEditTemplate();
          } else {
            return self.renderCreateTemplate();
          }
        });
      },
      '#create-prod click': function(el) {
        return this.createProduct();
      },
      '#delete-prod click': function(el) {
        if (this.productSelected() === true) {
          return this.deleteProduct();
        } else {
          return Helpers.showMessage('warning', 'No hay productos seleccionados para borrar!');
        }
      },
      '#update-prod click': function(el) {
        if (this.productSelected() === true) {
          return this.updateProduct();
        } else {
          return Helpers.showMessage('warning', 'No hay productos seleccionados para actualizar!');
        }
      },
      '#cancel-prod click': function(el) {
        return this.cleanMaps();
      },
      '.typeahead typeahead:autocompleted': function(el, ev, obj, dataset) {
        el.typeahead('close');
        return this.getProductDetails(obj._id);
      },
      '.typeahead typeahead:selected': function(el, ev, obj, dataset) {
        return this.getProductDetails(obj._id);
      },
      initControllerOptions: function() {
        this.options.product = new can.Map({
          code: '',
          name: '',
          price: 0,
          quantity: 0,
          provider: '',
          threshold: 0
        });
        this.options.productEdit = new can.Map({
          _id: '',
          code: '',
          name: '',
          price: 0,
          quantity: 0,
          provider: '',
          threshold: 0
        });
        this.options.productsList = new can.List([]);
        return this.options.productProviders = new can.List([]);
      },
      cleanMaps: function() {
        this.options.product.attr('code', '');
        this.options.product.attr('name', '');
        this.options.product.attr('price', 0);
        this.options.product.attr('quantity', 0);
        this.options.product.attr('provider', '');
        this.options.product.attr('threshold', 0);
        this.options.productEdit.attr('_id', '');
        this.options.productEdit.attr('code', '');
        this.options.productEdit.attr('name', '');
        this.options.productEdit.attr('price', 0);
        this.options.productEdit.attr('quantity', 0);
        this.options.productEdit.attr('provider', '');
        return this.options.productEdit.attr('threshold', 0);
      },
      productSelected: function() {
        if (this.options.productEdit._id) {
          return true;
        } else {
          return false;
        }
      },
      renderCreateTemplate: function() {
        return this.element.html(can.view('views/param/param-product.mustache', {
          product: this.options.product,
          providers: this.options.productProviders
        }));
      },
      renderEditTemplate: function() {
        var self;
        self = this;
        return can.when(this.getAllProducts()).then(function() {
          if (can.route.attr('productoid') !== void 0) {
            self.getProductDetails(can.route.attr('productoid'));
          }
          self.element.html(can.view('views/param/param-product-edit.mustache', {
            product: self.options.productEdit,
            providers: self.options.productProviders
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
          name: 'Productos',
          displayKey: 'value',
          source: self.filterProducts()
        });
      },
      filterProducts: function() {
        var findMatches, self;
        self = this;
        return findMatches = function(q, cb) {
          var matches, products, substrRegex;
          matches = [];
          products = self.options.productsList;
          substrRegex = new RegExp(q, 'i');
          products.forEach(function(product, index) {
            if (substrRegex.test(product.code) === true || substrRegex.test(product.name) === true) {
              return matches.push({
                value: product.name,
                _id: product._id
              });
            }
          });
          return cb(matches);
        };
      },
      updateProductInList: function() {
        var idToCompare, self;
        self = this;
        idToCompare = self.options.productEdit._id;
        return this.options.productsList.filter(function(product) {
          if (product._id === idToCompare) {
            return product.attr('name', self.options.productEdit.name);
          }
        });
      },
      removeProductInList: function() {
        var index, product, _i, _len, _ref, _results;
        _ref = this.options.productsList;
        _results = [];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          product = _ref[index];
          if (product._id === this.options.productEdit._id) {
            this.options.productsList.splice(index, 1);
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      createProduct: function() {
        var deferred, self;
        self = this;
        deferred = ProductModel.create(this.options.product.serialize());
        return deferred.then(function(response) {
          if (response.success === true) {
            Helpers.showMessage('success', 'Producto creado exitosamente');
            return self.cleanMaps();
          } else {
            return Helpers.showMessage('error', 'Error al crear producto, favor intentar de nuevo');
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al crear producto, favor intentar de nuevo');
        });
      },
      updateProduct: function() {
        var deferred, self;
        self = this;
        deferred = ProductModel.update(this.options.productEdit.serialize());
        return deferred.then(function(response) {
          if (response.success === true) {
            Helpers.showMessage('success', 'Producto actualizado exitosamente');
            self.updateProductInList();
            return self.cleanMaps();
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al actualizar producto, favor intentar de nuevo');
        });
      },
      deleteProduct: function() {
        var deferred, self;
        self = this;
        deferred = ProductModel.destroy({
          _id: this.options.productEdit._id
        });
        return deferred.then(function(response) {
          if (response.success === true) {
            Helpers.showMessage('success', 'Producto borrado exitosamente');
            self.removeProductInList();
            return self.cleanMaps();
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al intentar borrar producto, favor intentar de nuevo');
        });
      },
      getAllProducts: function() {
        var deferred, self;
        self = this;
        deferred = ProductModel.findAll({});
        deferred.then(function(response) {
          if (response.success === true) {
            return self.options.productsList.replace(response);
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error consiguiendo lista de productos, favor intentar de nuevo');
        });
        return deferred;
      },
      getProductProviders: function() {
        var deferred, self;
        self = this;
        deferred = ProviderModel.findAll({});
        deferred.then(function(response) {
          if (response.success === true) {
            return self.options.productProviders.replace(response);
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error consiguiendo lista de proveedores, favor intentar de nuevo');
        });
        return deferred;
      },
      getProductDetails: function(productId) {
        var deferred, self;
        self = this;
        deferred = ProductModel.findOne({
          _id: productId
        });
        return deferred.then(function(response) {
          if (response.success === true) {
            self.options.productEdit.attr('_id', response.data._id);
            self.options.productEdit.attr('code', response.data.code);
            self.options.productEdit.attr('name', response.data.name);
            self.options.productEdit.attr('price', response.data.price);
            self.options.productEdit.attr('quantity', response.data.quantity);
            self.options.productEdit.attr('provider', response.data.provider);
            return self.options.productEdit.attr('threshold', response.data.threshold);
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al traer detalles de producto, favor intentar de nuevo');
        });
      },
      destroy: function() {
        can.$('typeahead').typeahead('destroy');
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
