if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function(require) {
	var collectionName = 'provider'
	var provider = {
		list: function(mongo, req, res) {
			mongo.db.collection(collectionName).find({}).toArray(function(err, docs) {
				res.json(docs);
			})
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
			for(key in req.body){
				if(fields.indexOf(key) !== -1){
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
	}
	return provider;
});