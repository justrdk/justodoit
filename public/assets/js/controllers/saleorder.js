(function() {
  'use strict';
  define(['can', 'components/saleorderComponents', 'models/saleorderModels'], function(can, saleOrderComponent, SaleOrderModel) {
    var SaleOrder;
    return SaleOrder = can.Control.extend({
      init: function(element, options) {
        this.options.searchProducts = new can.List([]);
        this.options.orderProducts = new can.List([]);
        return this.element.html(can.view('views/saleorder/saleorder-layout.mustache', {
          products: this.options.searchProducts,
          orderProducts: this.options.orderProducts
        }));
      },
      '.search-inventory keyup': function(el) {
        var query, self;
        query = el.val().trim();
        self = this;
        clearTimeout(self.options.searchTimer);
        return self.options.searchTimer = setTimeout(function() {
          if (query !== '' && /\S+/.test(query) === true) {
            return self.getProductsByFilter(query);
          }
        }, 1200);
      },
      '.saleorder updateOrderDetail': function(el, ev, product) {
        if (this.productAlreadyInOrder(product) === false) {
          return this.insertProductInOrder(product);
        }
      },
      '.saleorder createSaleOrder': function(el, ev) {
        return this.createSaleOrder();
      },
      productAlreadyInOrder: function(product) {
        var prod, _i, _len, _ref;
        _ref = this.options.orderProducts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prod = _ref[_i];
          if (prod.code === product.code) {
            this.updateProductQuantityPrice(prod);
            return true;
          }
        }
        return false;
      },
      updateProductQuantityPrice: function(product) {
        if (product.quantity > 0) {
          can.batch.start();
          product.attr('quantityToSell', product.quantityToSell + 1);
          product.attr('quantity', product.quantity - 1);
          return can.batch.stop();
        }
      },
      insertProductInOrder: function(product) {
        can.batch.start();
        this.options.orderProducts.push({
          _id: product._id,
          code: product.code,
          name: product.name,
          quantityToSell: 1,
          price: product.price,
          quantity: product.quantity - 1
        });
        return can.batch.stop();
      },
      getProductsByFilter: function(query) {
        var deferred, self;
        self = this;
        deferred = SaleOrderModel.findAll({
          filter: query
        });
        return deferred.then(function(response) {
          if (response.success === true) {
            return self.options.searchProducts.replace(response);
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al buscar productos, favor intentar de nuevo');
        });
      },
      createSaleOrder: function() {
        var deferred, items, prod, self, _i, _len, _ref;
        self = this;
        items = can.List([]);
        _ref = this.options.orderProducts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prod = _ref[_i];
          items.push({
            productId: prod._id,
            quantityToSell: prod.quantityToSell
          });
        }
        deferred = SaleOrderModel.create({
          items: items
        });
        return deferred.then(function(response) {
          if (response.success) {
            Helpers.showMessage('success', 'Orden de venta ingresada exitosamente');
            return self.cleanOrder();
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al crear orden de venta, favor intentar de nuevo');
        });
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
