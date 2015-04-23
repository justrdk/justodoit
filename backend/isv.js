if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function(require) {
	var collectionName = 'isv';
	var isvId = '';

	var isv = {
		read: function(mongo, req, res) {
			var findJSON = {
				active: true
			};
			mongo.db.collection(collectionName).find(findJSON).toArray(function(err, docs) {
				if (docs.length) {
					res.json({
						success: true,
						data: docs[0]
					});
				} else {
					res.json({
						success: false,
						errorMessage: 'No se encontro isv creado',
						data: []
					});
				}
			});
		},
		update: function(mongo, req, res) {
			var fields = ["value"];
			isvId = req.body._id;
			var updateJSON = {};
			for (var key in req.body) {
				if (fields.indexOf(key) !== -1) {
					updateJSON[key] = req.body[key];
				}
			}
			mongo.db.collection(collectionName).update({
				"_id": mongo.objectId(isvId)
			}, {
				$set: updateJSON
			}, function(err, result) {
				if (err) {
					res.json({
						success: false,
						errorMessage: "Hubo un error en la actualizaciòn del ISV",
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
	return isv;
});
