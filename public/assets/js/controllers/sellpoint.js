(function() {
  'use strict';
  define(['can', 'components/sellpointComponents'], function(can) {
    var SellPoint;
    return SellPoint = can.Control.extend({
      init: function(element, options) {
        this.options.searchProducts = new can.List([]);
        this.options.orderProducts = new can.List([]);
        return this.element.html(can.view('views/sellpoint/sellpoint-layout.mustache', {
          products: this.options.searchProducts,
          orderProducts: this.options.orderProducts
        }));
      },
      '.search-inventory keyup': function(el) {
        var self;
        self = this;
        clearTimeout(self.options.searchTimer);
        return self.options.searchTimer = setTimeout(function() {
          return self.getProductsByFilter(el.val());
        }, 1200);
      },
      '.sellpoint updateOrderDetail': function(el, ev, product) {
        var prod, _i, _len, _ref;
        _ref = this.options.orderProducts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prod = _ref[_i];
          if (prod.CODE === product.CODE) {
            prod.attr('QUANTITY', prod.attr('QUANTITY') + 1);
            prod.attr('TOTAL', prod.QUANTITY * prod.PRICE);
            return;
          }
        }
        return this.options.orderProducts.push({
          CODE: product.CODE,
          NAME: product.NAME,
          QUANTITY: 1,
          PRICE: product.PRICE,
          TOTAL: product.PRICE
        });
      },
      getProductsByFilter: function(query) {
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
        return this.options.searchProducts.replace(dummyData);
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
