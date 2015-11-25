'use strict';

module.exports = {
	getAllUsers: function(request, reply) {
		var userService = require('../services/userService');

		userService.getAllUsers(request, function(data) {
			reply(data);
		});
	},

	getUser: function(request, reply) {
		var userService = require('../services/userService');

		userService.getUser(request, function(data) {
			reply(data);
		});
	},

	createUser: function(request, reply) {
		var userService = require('../services/userService');

		userService.createUser(request, function(data) {
			reply(data);
		});
	},

	updateUser: function(request, reply) {
		var userService = require('../services/userService');

		userService.updateUser(request, function(data) {
			reply(data);
		});
	},

	deleteUser: function(request, reply) {
		var userService = require('../services/userService');

		userService.deleteUser(request, function(data) {
			reply(data);
		});
	}
};
