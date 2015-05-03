module.exports = {
	getAllProviders: function(request, cb) {
		var db = request.server.plugins['hapi-mongodb'].db;
		var collectionName = 'provider';
		var providerId = '';

		var findJSON = {
			active: true
		};
		if (req.query.hasOwnProperty("filter")) {
			findJSON.name = new RegExp(req.query.filter, "i");
		}
		db.collection(collectionName).find(findJSON).toArray(function(err, docs) {
			if (docs.length) {
				cb({
					success: true,
					data: docs
				});
			} else {
				cb({
					success: false,
					errorMessage: 'No se encontraron proveedores con el filtro ingresado',
					data: []
				});
			}
		});
	},
	getProvider: function(request, cb) {
		var db = request.server.plugins['hapi-mongodb'].db;
		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
		var collectionName = 'provider';
		var providerId = '';
		providerId = req.params._id;

		db.collection(collectionName).find({
			_id: new ObjectId(providerId),
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
					errorMessage: "No existe el proveedor que desea leer"
				});
			}
		});
	},
	createProvider: function(request, cb) {
		var db = request.server.plugins['hapi-mongodb'].db;
		var collectionName = 'provider';
		var providerId = '';

		var newProvider = {
			name: req.payload.name,
			address: req.payload.address,
			phoneNumber: req.payload.phoneNumber,
			contact: req.payload.contact,
			active: true
		};

		db.collection(collectionName).save(newProvider, function(err, result) {
			if (err) {
				cb({
					success: false,
					errorMessage: "Hubo un error en la creación del proveedor",
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
	updateProvider: function(request, cb) {
		var db = request.server.plugins['hapi-mongodb'].db;
		var collectionName = 'provider';
		var providerId = '';
		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
		var fields = ["name", "address", "phoneNumber", "contact"];
		var updateJSON = {};
		providerId = req.payload._id;

		for (var key in req.payload) {
			if (fields.indexOf(key) !== -1) {
				updateJSON[key] = req.payload[key];
			}
		}
		db.collection(collectionName).update({
			"_id": new ObjectId(providerId)
		}, {
			$set: updateJSON
		}, function(err, result) {
			if (err) {
				cb({
					success: false,
					errorMessage: "Hubo un error en la actualizaciòn del proveedor",
					metadata: err
				});
			} else {
				cb({
					success: true
				});
			}
		});
	},
	deleteProvider: function(request, cb) {
		var db = request.server.plugins['hapi-mongodb'].db;
		var collectionName = 'provider';
		var providerId = '';
		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
		providerId = req.payload._id;

		db.collection(collectionName).update({
			"_id": new ObjectId(providerId)
		}, {
			$set: {
				active: false
			}
		}, function(err, result) {
			if (err) {
				cb({
					success: false,
					errorMessage: "Hubo un error en la eliminación del proveedor",
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
