module.exports = {
	getAllProducts : function(request, reply){
		var productService = require('../services/productService');

		productService.getAllProducts(request, function(data){
			reply(data);
		});
	},
	getProduct : function(request, reply){
		var productService = require('../services/productService');

		productService.getProduct(request, function(data){
			reply(data);
		});
	},
	createProduct : function(request, reply){
		var productService = require('../services/productService');

		productService.createProduct(request, function(data){
			reply(data);
		});
	},
	updateProduct : function(request, reply){
		var productService = require('../services/productService');

		productService.updateProduct(request, function(data){
			reply(data);
		});
	},
	deleteProduct : function(request, reply){
		var productService = require('../services/productService');

		productService.deleteProduct(request, function(data){
			reply(data);
		});
	}
};
