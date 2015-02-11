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
			,1200

		renderTemplate : ->
			@element.html can.view('views/salesdetails/salesdetails.mustache',
				products : @options.products
				startDate : @options.startDate,
				endDate: @options.endDate)

		initSalesDetailsOptions : ->
			@options.products = new can.List []
			@options.startDate = can.compute('')
			@options.endDate = can.compute('')

		filterProducts : (query) ->
			matches = new can.List []
			matchRegexp = new RegExp(query, 'i')

			for product in @options.products
				if matchRegexp.test(product.code) is true or matchRegexp.test(product.name) is true
					matches.push product

			can.$('.sales-details-table').html can.view('views/salesdetails/salesdetails-table.mustache',
				products : matches)

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