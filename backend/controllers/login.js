module.exports = {
	loginUser: function(request, reply) {
		var authService = require('../services/authService');

		authService.authenticateUser(request, function(data){
			reply(data);
		});
	},
	logoutUser : function(request, reply){
		var authService = require('../services/authService');

		authService.logOutUser(request, function(data){
			reply(data);
		});
	}
};
