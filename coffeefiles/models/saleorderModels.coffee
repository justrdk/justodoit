'use strict'

define ['can'], (can) ->

	SaleOrderModel = can.Model.extend
		findAll : 'GET /getSalesOrder'
		create : (params) ->
			$.ajax
	            url: '/createSalesOrder'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params)
	,{}
