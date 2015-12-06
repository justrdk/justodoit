'use strict'

define ['can', 'models/productModels'], (can, ProductModel) ->

	Inventory = can.Control.extend

		init: (element, options) ->
			self = @
			@options.products = new can.List []
			@options.dataRender = new can.List []

			can.when(@getProducts()).then ->
				self.calculatePages self.options.products
				self.options.dataRender = self.options.products.slice 0,10

				self.element.html can.view('views/inventory/inventory.mustache', 
					products : self.options.dataRender
					pages: self.options.pages)

				can.$('li.inventory-page:first').addClass 'active'

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

		'li.inventory-page click' : (ev) ->
			index = can.$('li.inventory-page').index ev.context
			can.$('li.inventory-page').removeClass 'active'
			can.$(ev.context).addClass 'active'
			startIndex = index * 10
			lastIndex = startIndex + 10
			@options.dataRender.replace @options.products.slice(startIndex, lastIndex)

		calculatePages : (data) -> 
			@options.amountPages = Math.ceil data.length / 10
			@options.pages = new can.List []
			@options.pages.push(i) for i in [1..@options.amountPages]
			
		showAllProducts : ->
			@calculatePages @options.products
			@options.dataRender.replace @options.products.slice 0,10

			can.$('.inventory-table').html can.view('views/inventory/inventory-table.mustache',
				products : @options.dataRender)

			can.$('.pagination-container').html can.view('views/inventory/pagination.mustache',
				pages : @options.pages)

			can.$('li.inventory-page:first').addClass 'active'

		filterProducts : (query) ->
			matches = new can.List []
			matchRegexp = new RegExp(query, 'i')

			matches.push(product) for product in @options.products when matchRegexp.test(product.code) is true or matchRegexp.test(product.name) is true
			@options.dataRender.replace matches
			@calculatePages @options.dataRender

			can.$('.inventory-table').html can.view('views/inventory/inventory-table.mustache',
				products : @options.dataRender.slice(0,10))

			can.$('.pagination-container').html can.view('views/inventory/pagination.mustache',
				pages : @options.pages)

			can.$('li.inventory-page:first').addClass 'active'

		getProducts : ->
			self = @
			deferred = ProductModel.findAll({})

			deferred.then (response) ->
				if response.success is true
					self.options.products.replace response
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				if xhr.status is 403
					Helpers.showMessage 'error', 'Su usuario no tiene privilegios para acceder a esta informacion'
				else
					Helpers.showMessage 'error', 'Error al cargar inventario, favor intentar de nuevo'

			deferred

		destroy : ->
			can.Control.prototype.destroy.call @
