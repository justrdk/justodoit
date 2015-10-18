"use strict";

module.exports = {
	getAllProviders : function(request, reply){
		var providerService = require('../services/providerService');

		providerService.getAllProviders(request, function(data){
			reply(data);
		});
	},
	getProvider : function(request, reply){
		var providerService = require('../services/providerService');

		providerService.getProvider(request, function(data){
			reply(data);
		});
	},
	createProvider : function(request, reply){
		var providerService = require('../services/providerService');

		providerService.createProvider(request, function(data){
			reply(data);
		});
	},
	updateProvider : function(request, reply){
		var providerService = require('../services/providerService');

		providerService.updateProvider(request, function(data){
			reply(data);
		});
	},
	deleteProvider : function(request, reply){
		var providerService = require('../services/providerService');

		providerService.deleteProvider(request, function(data){
			reply(data);
		});
	}
};
