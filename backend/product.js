if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function(require) {
	var collectionName = 'product'
	var provider = {
		list: function(mongo, req, res) {
			var findJSON = {
				active: true
			};
			if (req.query.hasOwnProperty("filter")) {
				var regVal = new RegExp(req.query.filter, "i");
				findJSON.$or = [{
					"code": regVal
				}, {
					"name": regVal
				}]
			}
			mongo.db.collection(collectionName).find(findJSON).toArray(function(err, docs) {
				res.json(docs);
			})
		},
		create: function(mongo, req, res) {
			var newProduct = {
				code: req.body.code,
				name: req.body.name,
				price: req.body.price,
				quantity: req.body.quantity,
				treshold: req.body.treshold,
				active: true
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
			var fields = ["code", "name", "price", "quantity", "provider", "treshold"];
			var updateJSON = {};
			for (key in req.body) {
				if (fields.indexOf(key) !== -1) {
					updateJSON[key] = req.body[key];
				}
			}
			mongo.db.collection(collectionName).update({
				"_id": mongo.objectId(req.body._id)
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
			mongo.db.collection(collectionName).update({
				"_id": mongo.objectId(req.body._id)
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
	return provider;
});