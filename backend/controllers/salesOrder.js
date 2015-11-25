'use strict';

module.exports = {
	findByDate: function(request, reply) {
		var salesOrderService = require('../services/salesOrderService');

		salesOrderService.findByDate(request, function(data) {
			reply(data);
		});
	},

	getAllSalesOrders: function(request, reply) {
		var salesOrderService = require('../services/salesOrderService');

		salesOrderService.getAllSalesOrders(request, function(data) {
			reply(data);
		});
	},

	getSalesOrder: function(request, reply) {
		var salesOrderService = require('../services/salesOrderService');

		salesOrderService.getSalesOrder(request, function(data) {
			reply(data);
		});
	},

	createSalesOrder: function(request, reply) {
		var salesOrderService = require('../services/salesOrderService');

		salesOrderService.createSalesOrder(request, function(data) {
			reply(data);
		});
	}
};
