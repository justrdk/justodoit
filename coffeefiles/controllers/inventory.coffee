'use strict'

define ['can', 'models/productModels'], (can, ProductModel) ->

	Inventory = can.Control.extend

		init: (element, options) ->
			self = @
			@options.products = new can.List []

			can.when(@getProducts()).then ->
				self.element.html can.view('views/inventory/inventory.mustache', 
					products : self.options.products)

		'.search-inventory keyup' : (el) ->
			query = el.val().trim()
			self = @
			clearTimeout self.options.searchTimer
			self.options.searchTimer = setTimeout ->
				if query isnt '' and /\S+/.test(query) is true
					self.filterProducts(query)
				else
					self.showAllProducts()
			,1200

		showAllProducts : ->
			can.$('.inventory-table').html can.view('views/inventory/inventory-table.mustache',
				products : @options.products)

		filterProducts : (query) ->
			matches = new can.List []
			matchRegexp = new RegExp(query, 'i')

			matches.push(product) for product in @options.products when matchRegexp.test(product.code) is true or matchRegexp.test(product.name) is true
			can.$('.inventory-table').html can.view('views/inventory/inventory-table.mustache',
				products : matches)

		getProducts : ->
			self = @
			deferred = ProductModel.findAll({})

			deferred.then (response) ->
				if response.success is true
					self.options.products.replace response
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al cargar inventario, favor intentar de nuevo'

			deferred

		destroy : ->
			can.Control.prototype.destroy.call @
