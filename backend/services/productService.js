module.exports = {
	getAllProducts: function(request, cb) {
		var db             = request.server.plugins['hapi-mongodb'].db;
		var collectionName = 'product';
		var providerCol    = 'provider';

		db.collection(providerCol).find({}, {
			name: true
		}).toArray(function(err, providers) {
			var providerMap = providers.reduce(function(ans, next) {
				ans[next._id] = next.name;
				return ans;
			}, {});

			var findJSON = {
				active: true
			};
			if (req.params.hasOwnProperty("filter")) {
				var regVal = new RegExp(req.params.filter, "i");
				findJSON.$or = [{
					"code": regVal
					}, {
					"name": regVal
					}];
			}
			db.collection(collectionName).find(findJSON).toArray(function(err, docs) {
				docs.forEach(function(product) {
					product.provider = providerMap[product.provider];
				});
				if (docs.length > 0) {
					cb({
						success: true,
						data: docs
					});
				} else {
					cb({
						success: false,
						errorMessage: 'No se encontraron productos con el filtro ingresado',
						data: []
					});
				}
			});
		});
	},
	getProduct: function(request, cb) {
		var db             = request.server.plugins['hapi-mongodb'].db;
		var ObjectId       = request.server.plugins['hapi-mongodb'].ObjectID;
		var productId      = req.params._id;
		var collectionName = 'product';

		db.collection(collectionName).find({
			_id: new ObjectId(productId),
			active: true
		}).toArray(function(err, docs) {
			if (docs.length) {
				cb({
					success: true,
					data: docs[0]
				});
			} else {
				cb({
					success: false,
					errorMessage: "No existe el producto que desea leer"
				});
			}
		});
	},
	createProduct: function(request, cb) {
		var collectionName = 'product';
		var db             = request.server.plugins['hapi-mongodb'].db;
		var newProduct 	   = {
			code: req.payload.code,
			name: req.payload.name,
			price: req.payload.price,
			quantity: req.payload.quantity,
			threshold: req.payload.threshold,
			active: true,
			provider: req.payload.provider
		};

		db.collection(collectionName).save(newProduct, function(err, result) {
			if (err) {
				cb({
					success: false,
					errorMessage: "Hubo un error en la creación del producto",
					metadata: err
				});
			} else {
				cb({
					success: true,
					id: result._id
				});
			}
		});
	},
	updateProduct: function(request, cb) {
		var collectionName = 'product';
		var db             = request.server.plugins['hapi-mongodb'].db;
		var ObjectId       = request.server.plugins['hapi-mongodb'].ObjectID;
		var fields         = ["code", "name", "price", "quantity", "provider", "threshold"];
		var productId      = req.payload._id;
		var updateJSON     = {};

		for (var key in req.payload) {
			if (fields.indexOf(key) !== -1) {
				updateJSON[key] = req.payload[key];
			}
		}
		db.collection(collectionName).update({
			"_id": new ObjectId(productId)
		}, {
			$set: updateJSON
		}, function(err, result) {
			if (err) {
				cb({
					success: false,
					errorMessage: "Hubo un error en la actualizaciòn del producto",
					metadata: err
				});
			} else {
				cb({
					success: true
				});
			}
		});
	},
	deleteProduct: function(request, reply) {
		var collectionName = 'product';
		var db             = request.server.plugins['hapi-mongodb'].db;
		var ObjectId       = request.server.plugins['hapi-mongodb'].ObjectID;
		var productId      = req.body._id;

		db.collection(collectionName).update({
			"_id": new ObjectId(productId)
		}, {
			$set: {
				active: false
			}
		}, function(err, result) {
			if (err) {
				cb({
					success: false,
					errorMessage: "Hubo un error en la eliminación del producto",
					metadata: err
				});
			} else {
				cb({
					success: true
				});
			}
		});
	}
};
