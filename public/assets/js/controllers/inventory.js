(function() {
  'use strict';
  define(['can'], function(can, inventoryComponent) {
    var Inventory;
    return Inventory = can.Control.extend({
      init: function(element, options) {
        this.options.dummyInventory = new can.List([]);
        this.options.searchTimer = null;
        this.getInventory();
        return this.element.html(can.view('views/inventory/inventory.mustache', {
          products: this.options.dummyInventory
        }));
      },
      '.search-inventory keyup': function(el) {
        var self;
        self = this;
        clearTimeout(self.options.searchTimer);
        return self.options.searchTimer = setTimeout(function() {
          return self.filterInventory(el.val());
        }, 1500);
      },
      'filterInventory': function(query) {
        var product, results, _i, _len, _ref;
        results = [];
        if (query.length === 0) {
          return can.$('.inventory-table').html(can.view('views/inventory/inventory-table.mustache', {
            products: this.options.dummyInventory
          }));
        } else {
          _ref = this.options.dummyInventory;
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
            PROVIDER: 'Copan'
          }, {
            CODE: 'LP2',
            NAME: 'Lapiz tinta negro BIC',
            QUANTITY: 15,
            PROVIDER: 'BIC'
          }, {
            CODE: 'CU2',
            NAME: 'Cuaderno 2 Materias Copan',
            QUANTITY: 2,
            PROVIDER: 'Copan'
          }, {
            CODE: 'BORR1',
            NAME: 'Borrador',
            QUANTITY: 5,
            PROVIDER: 'Borradores'
          }
        ];
        return this.options.dummyInventory.replace(dummyData);
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
