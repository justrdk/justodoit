module.exports = {
	getISV: function(request, reply) {
		var isvService = require('../services/isvService');

		isvService.getISV(request, function(data) {
			reply(data);
		});
	},
	updateISV: function(request, reply) {
		var isvService = require('../services/isvService');

		isvService.updateISV(request, function(data) {
			reply(data);
		});
	}
};
