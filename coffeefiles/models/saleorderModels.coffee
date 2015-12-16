'use strict'

define ['can'], (can) ->

	SaleOrderModel = can.Model.extend
		findOne : 'GET /getSalesOrder/{_id}'
		create : (params) ->
			$.ajax
	            url: '/createSalesOrder'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params)
	,{}
