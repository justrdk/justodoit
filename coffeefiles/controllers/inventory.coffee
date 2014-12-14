'use strict'

define ['can'], (can) ->

	Inventory = can.Control.extend

		init: (element, options) ->
			
			@options.products = new can.List []
			@options.searchTimer = null
			@getInventory()
			@element.html can.view('views/inventory/inventory.mustache', products: @options.products)

		'.search-inventory keyup' : (el) ->
			self = @
			clearTimeout self.options.searchTimer
			self.options.searchTimer = setTimeout ->
				self.filterInventory(el.val())
			,1200

		filterInventory : (query) ->
			results = []
			if query.length is 0
				can.$('.inventory-table').html can.view('views/inventory/inventory-table.mustache', products: @options.products)
			else
				for product in @options.products
					if product.CODE.toLowerCase().indexOf(query) isnt -1 or product.NAME.toLowerCase().indexOf(query) isnt -1 or 
					product.PROVIDER.toLowerCase().indexOf(query) isnt -1 then results.push(product) 
				if results.length > 0
					can.$('.inventory-table').html can.view('views/inventory/inventory-table.mustache', products: results)

		getInventory : ->
			dummyData = [{
					CODE : 'CU1'
					NAME : 'Cuaderno 3 Materias Copan'
					QUANTITY: 25
					PRICE: 35
					PROVIDER: 'Copan'
				}, {
					CODE : 'LP2'
					NAME : 'Lapiz tinta negro BIC'
					QUANTITY: 15
					PRICE: 12
					PROVIDER: 'BIC'
				},{
					CODE : 'CU2'
					NAME : 'Cuaderno 2 Materias Copan'
					QUANTITY: 2
					PRICE: 20
					PROVIDER: 'Copan'
				},{
					CODE : 'BORR1'
					NAME : 'Borrador'
					QUANTITY: 5
					PRICE: 10
					PROVIDER: 'Borradores'
				}]

			@options.products.replace(dummyData)

		destroy : ->
			can.Control.prototype.destroy.call @