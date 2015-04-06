(function() {
  'use strict';
  define(['can', 'models/salesdetailsModels'], function(can, SalesDetailModel) {
    var SalesDetails;
    return SalesDetails = can.Control.extend({
      init: function(element, options) {
        this.initSalesDetailsOptions();
        return this.renderTemplate();
      },
      '.search-order-details click': function(el) {
        return this.getSalesDetailsByDateRange();
      },
      '.search-sales-details keyup': function(el) {
        var query, self;
        query = el.val().trim();
        self = this;
        clearTimeout(self.options.searchTimer);
        return self.options.searchTimer = setTimeout(function() {
          if (query !== '' && /\S+/.test(query) === true) {
            return self.filterProducts(query);
          } else {
            return self.showAllProducts();
          }
        }, 1200);
      },
      renderTemplate: function() {
        return this.element.html(can.view('views/salesdetails/salesdetails.mustache', {
          products: this.options.products,
          startDate: this.options.startDate,
          endDate: this.options.endDate
        }, {
          formatDate: function(date) {
            return moment(date()).format('MM-DD-YYYY');
          }
        }));
      },
      renderTable: function(products) {
        return can.$('.sales-details-table').html(can.view('views/salesdetails/salesdetails-table.mustache', {
          products: products
        }, {
          formatDate: function(date) {
            return moment(date()).format('MM-DD-YYYY');
          }
        }));
      },
      initSalesDetailsOptions: function() {
        this.options.products = new can.List([]);
        this.options.startDate = can.compute('');
        return this.options.endDate = can.compute('');
      },
      showAllProducts: function() {
        return this.renderTable(this.options.products);
      },
      filterProducts: function(query) {
        var items, matchRegexp, matches, product, _i, _j, _len, _len1, _ref, _ref1;
        matches = new can.List([]);
        matchRegexp = new RegExp(query, 'i');
        _ref = this.options.products;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          product = _ref[_i];
          _ref1 = product.items;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            items = _ref1[_j];
            if (matchRegexp.test(items.name) === true) {
              matches.push(product);
            }
          }
        }
        return this.renderTable(matches);
      },
      getSalesDetailsByDateRange: function() {
        var deferred, self;
        self = this;
        deferred = SalesDetailModel.findAll({
          startDate: self.options.startDate(),
          endDate: self.options.endDate()
        });
        return deferred.then(function(response) {
          if (response.success === true) {
            return self.options.products.replace(response);
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error consiguiendo detalles de venta, favor intentar de nuevo');
        });
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
