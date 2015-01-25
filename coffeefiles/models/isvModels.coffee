'use strict'

define ['can'], (can) ->

	ISVModel = can.Model.extend
		findOne : 'GET /libuniversal/isv/read'
		update : (params) ->
			$.ajax
	            url: '/libuniversal/isv/update'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params) 
	,{}