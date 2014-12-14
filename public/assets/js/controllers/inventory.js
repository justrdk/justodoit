(function() {
  'use strict';
  define(['can'], function(can) {
    var Inventory;
    return Inventory = can.Control.extend({
      init: function(element, options) {
        this.options.products = new can.List([]);
        this.options.searchTimer = null;
        this.getInventory();
        return this.element.html(can.view('views/inventory/inventory.mustache', {
          products: this.options.products
        }));
      },
      '.search-inventory keyup': function(el) {
        var self;
        self = this;
        clearTimeout(self.options.searchTimer);
        return self.options.searchTimer = setTimeout(function() {
          return self.filterInventory(el.val());
        }, 1200);
      },
      filterInventory: function(query) {
        var product, results, _i, _len, _ref;
        results = [];
        if (query.length === 0) {
          return can.$('.inventory-table').html(can.view('views/inventory/inventory-table.mustache', {
            products: this.options.products
          }));
        } else {
          _ref = this.options.products;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            product = _ref[_i];
            if (product.CODE.toLowerCase().indexOf(query) !== -1 || product.NAME.toLowerCase().indexOf(query) !== -1 || product.PROVIDER.toLowerCase().indexOf(query) !== -1) {
              results.push(product);
            }
          }
          if (results.length > 0) {
            return can.$('.inventory-table').html(can.view('views/inventory/inventory-table.mustache', {
              products: results
            }));
          }
        }
      },
      getInventory: function() {
        var dummyData;
        dummyData = [
          {
            CODE: 'CU1',
            NAME: 'Cuaderno 3 Materias Copan',
            QUANTITY: 25,
            PRICE: 35,
            PROVIDER: 'Copan'
          }, {
            CODE: 'LP2',
            NAME: 'Lapiz tinta negro BIC',
            QUANTITY: 15,
            PRICE: 12,
            PROVIDER: 'BIC'
          }, {
            CODE: 'CU2',
            NAME: 'Cuaderno 2 Materias Copan',
            QUANTITY: 2,
            PRICE: 20,
            PROVIDER: 'Copan'
          }, {
            CODE: 'BORR1',
            NAME: 'Borrador',
            QUANTITY: 5,
            PRICE: 10,
            PROVIDER: 'Borradores'
          }
        ];
        return this.options.products.replace(dummyData);
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
