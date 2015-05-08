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
	path: "/getProviders",
	handler: controllers.provider.getAllProviders,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/getProviders/{filter}",
	handler: controllers.provider.getAllProviders,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/getProvider/{_id}",
	handler: controllers.provider.getProvider,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/createProvider",
	handler: controllers.provider.createProvider,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/updateProvider",
	handler: controllers.provider.updateProvider,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/deleteProvider",
	handler: controllers.provider.deleteProvider,
	config: {
		auth: {
			mode: "required",
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
	path: "/getProducts/{filter}",
	handler: controllers.product.getAllProducts,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/getProduct/{_id}",
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
}, {
	method: "GET",
	path: "/salesOrderByDate",
	handler: controllers.salesOrder.findByDate,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/getAllSalesOrders",
	handler: controllers.salesOrder.getAllSalesOrders,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/getSalesOrder/{_id}",
	handler: controllers.salesOrder.getSalesOrder,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/createSalesOrder",
	handler: controllers.salesOrder.createSalesOrder,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/getISV",
	handler: controllers.isv.getISV,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/updateISV",
	handler: controllers.isv.updateISV,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/{param*}",
	handler: {
		directory: {
			path: "../public",

		}
	},
	config: {
		auth: false
	}
}];