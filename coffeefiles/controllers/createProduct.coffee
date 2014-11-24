'use strict'

define ['can'], (can, object) ->

	Product = can.Control.extend

		init: (element, options) ->

			@options.product = new can.Map({
				code : ''
				name : ''
				quantity : ''
				provider : ''
			})
				
			@options.productProviders = new can.List []
			@getProductProviders()

			@element.html can.view('views/product/new-product.mustache', {
						product : @options.product
						providers : @options.productProviders
					})

			can.$("select").select2(dropdownCssClass : 'dropdown-inverse')

		getProductProviders : ->
			tempProviders = new can.List [{
					id : 1
					name : 'Copan'
				}, {
					id : 2
					name : 'Bic'
				}]

			@options.productProviders.replace tempProviders
		destroy : ->
			can.Control.prototype.destroy.call @