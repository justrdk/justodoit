'use strict'

define ['can'], (can) ->

	ISVModel = can.Model.extend
		findOne : 'GET /getISV'
		update : (params) ->
			$.ajax
	            url: '/updateISV'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params)
	,{}
