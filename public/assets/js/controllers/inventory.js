(function() {
  'use strict';
  define(['can', 'models/productModels'], function(can, ProductModel) {
    var Inventory;
    return Inventory = can.Control.extend({
      init: function(element, options) {
        var self;
        self = this;
        this.options.products = new can.List([]);
        return can.when(this.getProducts()).then(function() {
          return self.element.html(can.view('views/inventory/inventory.mustache', {
            products: self.options.products
          }));
        });
      },
      '.search-inventory keyup': function(el) {
        var query, self;
        query = el.val().trim();
        self = this;
        clearTimeout(self.options.searchTimer);
        return self.options.searchTimer = setTimeout(function() {
          if (query !== '' && /\S+/.test(query) === true) {
            return self.filterProducts(query);
          } else {
            return self.showAllProducts();
          }
        }, 1200);
      },
      showAllProducts: function() {
        return can.$('.inventory-table').html(can.view('views/inventory/inventory-table.mustache', {
          products: this.options.products
        }));
      },
      filterProducts: function(query) {
        var matchRegexp, matches, product, _i, _len, _ref;
        matches = new can.List([]);
        matchRegexp = new RegExp(query, 'i');
        _ref = this.options.products;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          product = _ref[_i];
          if (matchRegexp.test(product.code) === true || matchRegexp.test(product.name) === true) {
            matches.push(product);
          }
        }
        return can.$('.inventory-table').html(can.view('views/inventory/inventory-table.mustache', {
          products: matches
        }));
      },
      getProducts: function() {
        var deferred, self;
        self = this;
        deferred = ProductModel.findAll({});
        deferred.then(function(response) {
          if (response.success === true) {
            return self.options.products.replace(response);
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al cargar inventario, favor intentar de nuevo');
        });
        return deferred;
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
