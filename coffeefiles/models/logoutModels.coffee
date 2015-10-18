'use strict'

define ['can'], (can) ->

	LogOutModel = can.Model.extend
		findOne : 'GET /logout'
	, {}
