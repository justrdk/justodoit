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
        if (this.productAlreadyInOrder(product) === false) {
          this.insertProductInOrder(product);
        }
        return this.updateProductQuantityTable(product);
      },
      '.sellpoint increaseTableQuantity': function(el, ev, product) {
        var prod, _i, _len, _ref, _results;
        _ref = this.options.searchProducts;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prod = _ref[_i];
          if (prod.CODE === product.CODE) {
            prod.attr('QUANTITY_INVENTORY', prod.QUANTITY_INVENTORY + 1);
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      '.sellpoint decreaseTableQuantity': function(el, ev, product) {
        var prod, _i, _len, _ref, _results;
        _ref = this.options.searchProducts;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prod = _ref[_i];
          if (prod.CODE === product.CODE) {
            prod.attr('QUANTITY_INVENTORY', prod.QUANTITY_INVENTORY - 1);
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      productAlreadyInOrder: function(product) {
        var prod, _i, _len, _ref;
        _ref = this.options.orderProducts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prod = _ref[_i];
          if (prod.CODE === product.CODE) {
            this.updateProductQuantityPrice(prod);
            return true;
          }
        }
        return false;
      },
      updateProductQuantityPrice: function(product) {
        if (product.QUANTITY_INVENTORY > 0) {
          can.batch.start();
          product.attr('QUANTITY', product.QUANTITY + 1);
          product.attr('QUANTITY_INVENTORY', product.QUANTITY_INVENTORY - 1);
          product.attr('TOTAL', product.QUANTITY * product.PRICE);
          return can.batch.stop();
        }
      },
      insertProductInOrder: function(product) {
        can.batch.start();
        this.options.orderProducts.push({
          CODE: product.CODE,
          NAME: product.NAME,
          QUANTITY: 1,
          PRICE: product.PRICE,
          TOTAL: product.PRICE,
          QUANTITY_INVENTORY: product.QUANTITY_INVENTORY - 1
        });
        return can.batch.stop();
      },
      updateProductQuantityTable: function(product) {
        if (product.attr('QUANTITY_INVENTORY') > 0) {
          return product.attr('QUANTITY_INVENTORY', product.QUANTITY_INVENTORY - 1);
        }
      },
      getProductsByFilter: function(query) {
        var dummyData;
        dummyData = [
          {
            CODE: 'CU1',
            NAME: 'Cuaderno 3 Materias Copan',
            QUANTITY_INVENTORY: 25,
            PRICE: 35,
            PROVIDER: 'Copan'
          }, {
            CODE: 'LP2',
            NAME: 'Lapiz tinta negro BIC',
            QUANTITY_INVENTORY: 15,
            PRICE: 12,
            PROVIDER: 'BIC'
          }, {
            CODE: 'CU2',
            NAME: 'Cuaderno 2 Materias Copan',
            QUANTITY_INVENTORY: 2,
            PRICE: 20,
            PROVIDER: 'Copan'
          }, {
            CODE: 'BORR1',
            NAME: 'Borrador',
            QUANTITY_INVENTORY: 5,
            PRICE: 10,
            PROVIDER: 'Borradores'
          }, {
            CODE: 'MOCH1',
            NAME: 'Mochila',
            QUANTITY_INVENTORY: 20,
            PRICE: 550,
            PROVIDER: 'Jansport'
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
