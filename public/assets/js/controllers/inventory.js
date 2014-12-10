(function() {
  'use strict';
  define(['can', 'components/inventoryComponents'], function(can, inventoryComponent) {
    var Inventory;
    return Inventory = can.Control.extend({
      init: function(element, options) {
        this.options.dummyInventory = new can.List([]);
        this.getInventory();
        inventoryComponent = can.mustache("<inventory-table products='{products}'></inventory-table>");
        return this.element.html(inventoryComponent({
          products: this.options.dummyInventory
        }));
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
            CODE: 'CU1',
            NAME: 'Cuaderno 3 Materias Copan',
            QUANTITY: 25,
            PROVIDER: 'Copan'
          }, {
            CODE: 'CU1',
            NAME: 'Cuaderno 3 Materias Copan',
            QUANTITY: 25,
            PROVIDER: 'Copan'
          }, {
            CODE: 'CU1',
            NAME: 'Cuaderno 3 Materias Copan',
            QUANTITY: 25,
            PROVIDER: 'Copan'
          }, {
            CODE: 'CU1',
            NAME: 'Cuaderno 3 Materias Copan',
            QUANTITY: 25,
            PROVIDER: 'Copan'
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
