'use strict';

module.exports = {
	getRoles: function(request, cb) {
		var db = request.mongo.db;
		var roleCol = 'role';

		db.collection(roleCol).find({
			active: true
		}, {
			active: false,
			_id: false
		}).toArray(function(err, roles) {
			if (roles.length > 0) {
				return cb({
					success: true,
					data: roles
				});
			}

			return cb({
				success: false,
				errorMessage: 'No se encontraron roles',
				data: []
			});
		});
	}
};
