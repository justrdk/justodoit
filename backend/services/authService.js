module.exports = {
	authenticateUser: function(request, cb) {
		var userCollection = 'user';
		var db = request.server.plugins['hapi-mongodb'].db;
		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

		if (request.auth.isAuthenticated) {
			cb({
				success: true,
				name: request.auth.credentials.username,
				role: request.auth.credentials.role
			});
		}

		if (!request.payload.username || !request.payload.password) {
			return {
				success: false,
				error: 'Missing username or password'
			};
		} else {
			db.collection(userCollection).findOne({
				'username': request.payload.username
			}, function(err, user) {
				if (err) {
					cb({
						success: false,
						error: 'Internal MongoDB error'
					});
				}

				if (!user || user.password !== request.payload.password) {
					cb({
						success: false,
						error: 'Invalid username or password'
					});
				} else {
					request.auth.session.set(user);
					cb({
						success: true,
						user: user
					});
				}
			});
		}
	}
};
