if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function(require) {
	var collectionName = 'product';
	var providerCol = 'provider';
	var productId = '';

	var product = {
		list: function(mongo, req, res) {
			mongo.db.collection(providerCol).find({}, {
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
				mongo.db.collection(collectionName).find(findJSON).toArray(function(err, docs) {
					docs.forEach(function(product) {
						product.provider = providerMap[product.provider]
					})
					if (docs.length > 0) {
						res.json({
							success: true,
							data: docs
						});
					} else {
						res.json({
							success: false,
							errorMessage: 'No se encontraron productos con el filtro ingresado',
							data: []
						});
					}
				});
			});
		},
		read: function(mongo, req, res) {
			productId = req.params._id;
			mongo.db.collection(collectionName).find({
				_id: mongo.objectId(productId),
				active: true
			}).toArray(function(err, docs) {
				if (docs.length) {
					res.json({
						success: true,
						data: docs[0]
					})
				} else {
					res.json({
						success: false,
						errorMessage: "No existe el producto que desea leer"
					})
				}
			})
		},
		create: function(mongo, req, res) {
			var newProduct = {
				code: req.body.code,
				name: req.body.name,
				price: req.body.price,
				quantity: req.body.quantity,
				threshold: req.body.threshold,
				active: true,
				provider: req.body.provider
			};

			mongo.db.collection(collectionName).save(newProduct, function(err, result) {
				if (err) {
					res.json({
						success: false,
						errorMessage: "Hubo un error en la creación del producto",
						metadata: err
					});
				} else {
					res.json({
						success: true,
						id: result._id
					});
				}
			});
		},
		update: function(mongo, req, res) {
			var fields = ["code", "name", "price", "quantity", "provider", "threshold"];
			productId = req.body._id;
			var updateJSON = {};
			for (key in req.body) {
				if (fields.indexOf(key) !== -1) {
					updateJSON[key] = req.body[key];
				}
			}
			mongo.db.collection(collectionName).update({
				"_id": mongo.objectId(productId)
			}, {
				$set: updateJSON
			}, function(err, result) {
				if (err) {
					res.json({
						success: false,
						errorMessage: "Hubo un error en la actualizaciòn del producto",
						metadata: err
					});
				} else {
					res.json({
						success: true
					});
				}
			});
		},
		delete: function(mongo, req, res) {
			productId = req.body._id;
			mongo.db.collection(collectionName).update({
				"_id": mongo.objectId(productId)
			}, {
				$set: {
					active: false
				}
			}, function(err, result) {
				if (err) {
					res.json({
						success: false,
						errorMessage: "Hubo un error en la eliminación del producto",
						metadata: err
					});
				} else {
					res.json({
						success: true
					});
				}
			});
		}
	}
	return product;
});