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
        increaseProductQuantity: function(product, el) {
          var newQuantity;
          newQuantity = product.attr('QUANTITY') + 1;
          product.attr('QUANTITY', newQuantity);
          return product.attr('TOTAL', newQuantity * product.PRICE);
        },
        decreaseProductQuantity: function(product, el) {
          var newQuantity;
          if (product.attr('QUANTITY') > 0) {
            newQuantity = product.attr('QUANTITY') - 1;
            if (newQuantity === 0) {
              return this.removeProductFromOrder(product);
            } else {
              product.attr('QUANTITY', newQuantity);
              return product.attr('TOTAL', newQuantity * product.PRICE);
            }
          }
        },
        removeProductFromOrder: function(product) {
          var productIndex;
          productIndex = this.attr('orderproducts').indexOf(product);
          return this.attr('orderproducts').splice(productIndex, 1);
        }
      }
    });
  });

}).call(this);
