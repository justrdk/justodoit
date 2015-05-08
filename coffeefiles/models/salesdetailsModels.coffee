'use strict'

define ['can'], (can) ->

	SalesDetailsModel = can.Model.extend
		findAll : (params) ->
			$.ajax
	            url: '/salesOrderByDate'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params)
	,{}
