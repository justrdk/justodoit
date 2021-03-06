'use strict';

module.exports = {
	getAllProducts: function(request, cb) {
		var db = request.mongo.db;
		var collectionName = 'product';
		var providerCol = 'provider';

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
			if (request.params.hasOwnProperty('filter')) {
				var regVal = new RegExp(request.params.filter, 'i');
				findJSON.$or = [{
					'code': regVal
				}, {
					'name': regVal
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
		var db = request.mongo.db;
		var ObjectId = request.mongo.ObjectID;
		var productId = request.params._id;
		var collectionName = 'product';

		db.collection(collectionName).findOne({
			_id: new ObjectId(productId),
			active: true
		}, function(err, product) {
			if (product) {
				cb({
					success: true,
					data: product
				});
			} else {
				cb({
					success: false,
					errorMessage: 'Producto no encontrado en el sistema'
				});
			}
		});
	},

	createProduct: function(request, cb) {
		var collectionName = 'product';
		var db = request.mongo.db;
		var newProduct = {
			code: request.payload.code,
			name: request.payload.name,
			price: request.payload.price,
			quantity: request.payload.quantity,
			threshold: request.payload.threshold,
			active: true,
			provider: request.payload.provider,
			tax: request.payload.tax
		};

		db.collection(collectionName).save(newProduct, function(err, result) {
			if (err) {
				cb({
					success: false,
					errorMessage: 'Hubo un error en la creación del producto',
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
		var db = request.mongo.db;
		var ObjectId = request.mongo.ObjectID;
		var fields = ['code', 'name', 'price', 'quantity', 'provider', 'threshold', 'tax'];
		var productId = request.payload._id;
		var updateJSON = {};

		for (var key in request.payload) {
			if (fields.indexOf(key) !== -1) {
				updateJSON[key] = request.payload[key];
			}
		}

		db.collection(collectionName).update({
			'_id': new ObjectId(productId)
		}, {
			$set: updateJSON
		}, function(err) {
			if (err) {
				cb({
					success: false,
					errorMessage: 'Hubo un error en la actualizaciòn del producto',
					metadata: err
				});
			} else {
				cb({
					success: true
				});
			}
		});
	},

	deleteProduct: function(request, cb) {
		var collectionName = 'product';
		var db = request.mongo.db;
		var ObjectId = request.mongo.ObjectID;
		var productId = request.payload._id;

		db.collection(collectionName).update({
			'_id': new ObjectId(productId)
		}, {
			$set: {
				active: false
			}
		}, function(err) {
			if (err) {
				cb({
					success: false,
					errorMessage: 'Hubo un error en la eliminación del producto',
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
