(function() {
  'use strict';
  define(['can'], function(can) {
    can.Component.extend({
      tag: 'query-products',
      scope: {
        selectProduct: function(product, el) {
          return can.$('.sellpoint').trigger('updateOrderDetail', product);
        }
      }
    });
    return can.Component.extend({
      tag: 'order-products',
      scope: {
        subtotal: 0,
        tax: 0,
        taxPercentage: 1.12,
        total: 0,
        cashPaid: 0,
        cashChange: 0,
        increaseProductQuantity: function(product, el) {
          var newQuantity;
          newQuantity = product.attr('QUANTITY') + 1;
          product.attr('QUANTITY', newQuantity);
          product.attr('TOTAL', newQuantity * product.PRICE);
          if (product.QUANTITY_INVENTORY > 0) {
            product.attr('QUANTITY_INVENTORY', product.QUANTITY_INVENTORY - 1);
            can.$('.sellpoint').trigger('decreaseTableQuantity', product);
          }
          return this.calculateSubtotal(product);
        },
        decreaseProductQuantity: function(product, el) {
          var newQuantity;
          if (product.attr('QUANTITY') > 0) {
            newQuantity = product.attr('QUANTITY') - 1;
            product.attr('QUANTITY_INVENTORY', product.QUANTITY_INVENTORY + 1);
            if (newQuantity === 0) {
              this.removeProductFromOrder(product);
            } else {
              product.attr('QUANTITY', newQuantity);
              product.attr('TOTAL', newQuantity * product.PRICE);
            }
          }
          can.$('.sellpoint').trigger('increaseTableQuantity', product);
          return this.calculateSubtotal(product);
        },
        removeProductFromOrder: function(product) {
          var productIndex;
          productIndex = this.attr('orderproducts').indexOf(product);
          return this.attr('orderproducts').splice(productIndex, 1);
        },
        calculateSubtotal: function(product) {
          var subtotal, _i, _len, _ref;
          subtotal = 0;
          _ref = this.attr('orderproducts');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            product = _ref[_i];
            subtotal += product.TOTAL;
          }
          return this.attr('subtotal', subtotal);
        }
      },
      helpers: {
        roundTwoDecimalPlaces: function(value) {
          return parseFloat(Math.round(value() * 100) / 100).toFixed(2);
        }
      },
      events: {
        '{orderproducts} change': function(el, ev, attr, how, newVal, oldVal) {
          if (how !== 'remove') {
            return this.scope.calculateSubtotal(newVal[0]);
          }
        }
      }
    });
  });

}).call(this);
