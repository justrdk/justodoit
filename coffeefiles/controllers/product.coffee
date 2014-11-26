'use strict'

define ['can'], (can) ->

	Product = can.Control.extend

		init : (element, options) ->

			@options.product = new can.Map({
				code : ''
				name : ''
				quantity : ''
				provider : ''
			})
				
			@options.productProviders = new can.List []
			@getProductProviders()
			
			if @options.edit isnt undefined and @options.edit is true
				if can.route.attr('productoid') isnt undefined
					@getProductDetails can.route.attr('productoid')
				@element.html can.view('views/param/param-product.mustache', {
					product : @options.product
					providers : @options.productProviders,
					edit : @options.edit
				})

			else
				@element.html can.view('views/param/param-product.mustache', {
					product : @options.product
					providers : @options.productProviders,
					edit : false
				})

			can.$("select").select2(dropdownCssClass : 'dropdown-inverse')

		'#create-prod click' : (el) ->
			#make request to create product
		'#delete-prod click' : (el) ->
			#make request to delete product
		'#update-prod click' : (el) ->
			#make request to update product
		'#cancel-prod click' : (el) ->
			#clean map
			@options.product.attr('code', '')
			@options.product.attr('name', '')
			@options.product.attr('quantity', '')
			@options.product.attr('provider', '')

		getProductDetails : (productId)->
			tempDetails = {
					id:"1"
					code: 'CUNICO123'
					name: 'Cuaderno Unico Copan, 3 Materias'
					quantity: 10
					provider : 1
				}

			@options.product.attr('code', tempDetails.code)
			@options.product.attr('name', tempDetails.name)
			@options.product.attr('quantity', tempDetails.quantity)
			@options.product.attr('provider', tempDetails.provider)

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