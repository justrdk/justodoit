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
	handler: controllers.login.getAuthenticatedUser,
	config: {
		auth: {
			mode: "optional",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/getProducts",
	handler: controllers.product.getAllProducts,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/getProduct",
	handler: controllers.product.getProduct,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/createProduct",
	handler: controllers.product.createProduct,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/updateProduct",
	handler: controllers.product.updateProduct,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/deleteProduct",
	handler: controllers.product.deleteProduct,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}];