'use strict';

module.exports = {
	getRoles: function(request, reply) {
		var roleService = require('../services/roleService');

		roleService.getRoles(request, function(roles) {
			reply(roles);
		});
	}
};
