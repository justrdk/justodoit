(function() {
  'use strict';
  define(['can'], function(can) {
    return can.Component.extend({
      tag: 'inventory-table',
      template: can.view('views/inventory/inventory-table.mustache'),
      scope: {},
      helpers: {},
      events: {
        '.search-inventory keyup': function(el) {
          return window.setTimeout(function() {
            return console.log('testing delay');
          }, 1100);
        }
      }
    });
  });

}).call(this);
