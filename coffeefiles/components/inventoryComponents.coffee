'use strict'

define ['can'], (can) ->

	can.Component.extend
		tag: 'inventory-table'
		template: can.view 'views/inventory/inventory-table.mustache'
		scope: {}
		helpers: {}
		events: 
			'.search-inventory keyup' : (el) ->
				window.setTimeout ->
					console.log('testing delay')
				, 1100
