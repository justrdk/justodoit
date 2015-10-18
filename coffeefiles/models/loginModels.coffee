'use strict'

define ['can'], (can) ->

	LoginModel = can.Model.extend
		findOne : 'GET /getAuthenticatedUser'
		create : (attrs) ->
			$.post '/login', attrs
	, {}
