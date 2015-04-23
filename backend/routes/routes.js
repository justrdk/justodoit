var requireDir = require('require-directory');
var controllers = requireDir(module, '../controllers/');

module.exports = [{
	method: 'POST',
	path: '/login',
	config: {
		handler: controllers.login.loginUser,
		auth: {
			mode: 'try',
			strategy: 'session'
		},
		plugins: {
			'hapi-auth-cookie': {
				redirectTo: false
			}
		}
	}
}, {
	method: 'GET',
	path: '/logout',
	config: {
		handler: controllers.login.logoutUser,
		auth: 'session'
	}
}, {
	method: "GET",
	path: "/getAuthenticatedUser",
	handler: getAuthenticatedUser,
	config: {
		auth: {
			mode: "optional",
			strategy: "session"
		}
	}
}];
