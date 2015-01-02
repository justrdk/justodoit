(function() {
  'use strict';
  define(['can'], function(can) {
    can.Component.extend({
      tag: 'query-products',
      scope: {
        selectProduct: function(product, el) {
          return can.$('.saleorder').trigger('updateOrderDetail', product);
        }
      }
    });
    return can.Component.extend({
      tag: 'order-products',
      scope: {
        validSale: false,
        subtotal: 0,
        tax: 0,
        taxPercentage: 0.15,
        total: 0,
        cashPaid: 0,
        cashChange: 0,
        timer: 0,
        increaseProductQuantity: function(product, el) {
          var newQuantity;
          if (product.quantity > 0) {
            newQuantity = product.attr('quantityToSell') + 1;
            this.updateProductQuantity(product, newQuantity);
            product.attr('quantity', product.quantity - 1);
            return this.calculateSubtotal(product);
          } else {
            return Helpers.showMessage('warning', 'Actual cantidad es el maximo en inventario de producto');
          }
        },
        decreaseProductQuantity: function(product, el) {
          var newQuantity;
          if (product.attr('quantityToSell') > 0) {
            newQuantity = product.attr('quantityToSell') - 1;
            product.attr('quantity', product.quantity + 1);
            if (newQuantity === 0) {
              this.removeProductFromOrder(product);
            } else {
              this.updateProductQuantity(product, newQuantity);
            }
          }
          return this.calculateSubtotal(product);
        },
        removeProductFromOrder: function(product) {
          var productIndex;
          productIndex = this.attr('orderproducts').indexOf(product);
          return this.attr('orderproducts').splice(productIndex, 1);
        },
        updateProductQuantity: function(product, newQuantity) {
          return product.attr('quantityToSell', newQuantity);
        },
        calculateSubtotal: function(product) {
          var subtotal, _i, _len, _ref;
          subtotal = 0;
          _ref = this.attr('orderproducts');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            product = _ref[_i];
            subtotal += product.price * product.quantityToSell;
          }
          return this.attr('subtotal', subtotal);
        },
        calculateTax: function() {
          return this.attr('tax', this.subtotal * this.taxPercentage);
        },
        calculateTotal: function() {
          return this.attr('total', this.subtotal + this.tax);
        },
        calculateChange: function() {
          if (this.cashPaid >= this.total) {
            this.attr('cashChange', this.cashPaid - this.total);
            return this.attr('validSale', true);
          } else {
            this.attr('validSale', false);
            this.attr('cashChange', this.cashPaid - this.total);
            return Helpers.showMessage('warning', 'Total a pagar no esta cancelado en su totalidad');
          }
        },
        createSaleOrder: function(context, el) {},
        cancelSaleOrder: function() {
          var _results;
          _results = [];
          while (this.orderproducts.length > 0) {
            _results.push(this.orderproducts.pop());
          }
          return _results;
        }
      },
      helpers: {
        roundTwoDecimalPlaces: function(value) {
          return parseFloat(Math.round(value() * 100) / 100).toFixed(2);
        }
      },
      events: {
        '.cash-paid keyup': function(el) {
          var change, self;
          self = this;
          change = el.val().trim();
          clearTimeout(this.scope.timer);
          return this.scope.attr('timer', setTimeout(function() {
            if (change !== '' && /\S+/.test(change) === true && isNaN(change) === false) {
              self.scope.attr('cashPaid', change);
              return self.scope.calculateChange();
            }
          }, 1100));
        },
        '{orderproducts} change': function(el, ev, attr, how, newVal, oldVal) {
          if (how !== 'remove') {
            this.scope.calculateSubtotal(newVal[0]);
            this.scope.calculateTax();
            return this.scope.calculateTotal();
          }
        }
      }
    });
  });

}).call(this);
