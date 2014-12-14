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
      tag: 'order-detail',
      scope: {
        increaseQuantity: function(product, el) {
          return console.log('product', product);
        },
        decreaseQuantity: function(product, el) {
          return console.log('product', product);
        }
      }
    });
  });

}).call(this);
