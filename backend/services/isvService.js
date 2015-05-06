module.exports = {
	getISV: function(request, cb) {
		var db = request.server.plugins['hapi-mongodb'].db;
		var collectionName = 'isv';
		var isvId = '';

		var findJSON = {
			active: true
		};
		db.collection(collectionName).find(findJSON).toArray(function(err, docs) {
			if (docs.length) {
				cb({
					success: true,
					data: docs[0]
				});
			} else {
				cb({
					success: false,
					errorMessage: 'No se encontro isv creado',
					data: []
				});
			}
		});
	},
	updateISV: function(request, cb) {
		var db = request.server.plugins['hapi-mongodb'].db;
		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
		var collectionName = 'isv';
		var isvId = '';

		var fields = ["value"];
		isvId = req.payload._id;
		var updateJSON = {};
		for (var key in req.payload) {
			if (fields.indexOf(key) !== -1) {
				updateJSON[key] = req.payload[key];
			}
		}
		db.collection(collectionName).update({
			"_id": new ObjectId(isvId)
		}, {
			$set: updateJSON
		}, function(err, result) {
			if (err) {
				cb({
					success: false,
					errorMessage: "Hubo un error en la actualizaciòn del ISV",
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
