'use strict';

module.exports = {
	getAllProviders: function(request, cb) {
		var db = request.server.plugins['hapi-mongodb'].db;
		var collectionName = 'provider';
		var findJSON = {
			active: true
		};

		if (request.query.hasOwnProperty("filter")) {
			findJSON.name = new RegExp(request.query.filter, "i");
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
		providerId = request.params._id;

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

		var newProvider = {
			name: request.payload.name,
			address: request.payload.address,
			phoneNumber: request.payload.phoneNumber,
			contact: request.payload.contact,
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
		providerId = request.payload._id;

		for (var key in request.payload) {
			if (fields.indexOf(key) !== -1) {
				updateJSON[key] = request.payload[key];
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
		providerId = request.payload._id;

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
