'use strict'

define ['can'], (can) ->

	RoleModel = can.Model.extend
		findAll : 'GET /getRoles'
	,{}
