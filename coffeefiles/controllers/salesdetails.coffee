'use strict'

define ['can', 'models/salesdetailsModels'], (can, SalesDetailModel) ->

	SalesDetails = can.Control.extend

		init : (element, options) ->
			@initSalesDetailsOptions()
			@renderTemplate()

		'.search-order-details click' : (el) ->
			@getSalesDetailsByDateRange()

		'.search-sales-details keyup' : (el) ->
			query = el.val().trim()
			self = @
			clearTimeout self.options.searchTimer
			self.options.searchTimer = setTimeout ->
				if query isnt '' and /\S+/.test(query) is true
					self.filterProducts(query)
				else
					self.showAllProducts()
			,1200

		renderTemplate : ->
			@element.html can.view('views/salesdetails/salesdetails.mustache',
				products : @options.products
				startDate : @options.startDate
				endDate: @options.endDate
			,
				formatDate : (date) ->
					moment(date()).format 'MM-DD-YYYY' 
			)

		renderTable : (products) ->
			can.$('.sales-details-table').html can.view('views/salesdetails/salesdetails-table.mustache',
					products : products
				,
					formatDate : (date) ->
						moment(date()).format 'MM-DD-YYYY'
				)

		initSalesDetailsOptions : ->
			@options.products = new can.List []
			@options.startDate = can.compute ''
			@options.endDate = can.compute ''

		showAllProducts : ->
			@renderTable @options.products

		filterProducts : (query) ->
			matches = new can.List []
			matchRegexp = new RegExp(query, 'i')
			
			for product in @options.products
				for items in product.items
					if matchRegexp.test(items.name) is true
						matches.push product

			@renderTable matches

		getSalesDetailsByDateRange : ->
			self = @
			deferred = SalesDetailModel.findAll
				startDate: self.options.startDate()
				endDate : self.options.endDate()

			deferred.then (response) ->
				if response.success is true
					self.options.products.replace response
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error consiguiendo detalles de venta, favor intentar de nuevo'

		destroy : ->
			can.Control.prototype.destroy.call @