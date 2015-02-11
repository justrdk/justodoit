'use strict'

define ['can'], (can) ->

	SalesDetailsModel = can.Model.extend
		findAll : (params) ->
			$.ajax
	            url: '/libuniversal/salesOrder/findByDate'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params) 
	,{}