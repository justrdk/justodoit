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
	method: "POST",
	path: "/createProvider",
	handler: controllers.provider.createProvider,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "POST",
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
	method: "POST",
	path: "/createProduct",
	handler: controllers.product.createProduct,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "POST",
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
	path: "/getUsers",
	handler: controllers.user.getAllUsers,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/getUsers/{filter}",
	handler: controllers.user.getAllUsers,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/getUser/{_id}",
	handler: controllers.user.getUser,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "POST",
	path: "/createUser",
	handler: controllers.user.createUser,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "POST",
	path: "/updateUser",
	handler: controllers.user.updateUser,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "GET",
	path: "/deleteUser",
	handler: controllers.user.deleteUser,
	config: {
		auth: {
			mode: "required",
			strategy: "session"
		}
	}
}, {
	method: "POST",
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
	method: "POST",
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
	method: "POST",
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
