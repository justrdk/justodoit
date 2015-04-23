if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function(require) {
	var collectionName = 'provider';
	var providerId = '';

	var provider = {
		list: function(mongo, req, res) {
			var findJSON = {
				active: true
			};
			if (req.query.hasOwnProperty("filter")) {
				findJSON.name = new RegExp(req.query.filter, "i");
			}
			mongo.db.collection(collectionName).find(findJSON).toArray(function(err, docs) {
				if (docs.length) {
					res.json({
						success: true,
						data: docs
					});
				} else {
					res.json({
						success: false,
						errorMessage: 'No se encontraron proveedores con el filtro ingresado',
						data: []
					});
				}
			});
		},
		read: function(mongo, req, res) {
			providerId = req.params._id;
			mongo.db.collection(collectionName).find({
				_id: mongo.objectId(providerId),
				active: true
			}).toArray(function(err, docs) {
				if (docs.length) {
					res.json({
						success: true,
						data: docs[0]
					});
				} else {
					res.json({
						success: false,
						errorMessage: "No existe el proveedor que desea leer"
					});
				}
			});
		},
		create: function(mongo, req, res) {
			var newProvider = {
				name: req.body.name,
				address: req.body.address,
				phoneNumber: req.body.phoneNumber,
				contact: req.body.contact,
				active: true
			};

			mongo.db.collection(collectionName).save(newProvider, function(err, result) {
				if (err) {
					res.json({
						success: false,
						errorMessage: "Hubo un error en la creación del proveedor",
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
			var fields = ["name", "address", "phoneNumber", "contact"];
			var updateJSON = {};
			providerId = req.body._id;
			for (var key in req.body) {
				if (fields.indexOf(key) !== -1) {
					updateJSON[key] = req.body[key];
				}
			}
			mongo.db.collection(collectionName).update({
				"_id": mongo.objectId(providerId)
			}, {
				$set: updateJSON
			}, function(err, result) {
				if (err) {
					res.json({
						success: false,
						errorMessage: "Hubo un error en la actualizaciòn del proveedor",
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
			providerId = req.body._id;
			mongo.db.collection(collectionName).update({
				"_id": mongo.objectId(providerId)
			}, {
				$set: {
					active: false
				}
			}, function(err, result) {
				if (err) {
					res.json({
						success: false,
						errorMessage: "Hubo un error en la eliminación del proveedor",
						metadata: err
					});
				} else {
					res.json({
						success: true
					});
				}
			});
		}
	};
	return provider;
});
