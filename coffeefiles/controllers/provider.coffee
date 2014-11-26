'use strict'

define ['can'], (can) ->

	Provider = can.Control.extend

		init : (element, options) ->

			@options.provider = new can.Map({
				name : ''
				address : ''
				phoneNumber : ''
			})
			
			if @options.edit isnt undefined and @options.edit is true
				if can.route.attr('proveedorid') isnt undefined
					@getProviderDetails can.route.attr('proveedorid')
				@element.html can.view('views/param/param-provider.mustache', {
					provider : @options.provider
					edit : @options.edit
				})

			else
				@element.html can.view('views/param/param-provider.mustache', {
					provider : @options.provider
					edit : false
				})

		'#create-prov click' : (el) ->
			#make request to create provider
		'#delete-prov click' : (el) ->
			#make request to delete provider
		'#update-prov click' : (el) ->
			#make request to update provider
		'#cancel-prov click' : (el) ->
			#clean map
			@options.provider.attr('name', '')
			@options.provider.attr('address', '')
			@options.provider.attr('phoneNumber', '')
			
		getProviderDetails : (productId)->
			tempDetails = {
					name: 'Bic'
					address: 'Col.Foo, 5ta Bar, Bloque Z'
					phoneNumber : '3333-3333'
				}

			@options.provider.attr('name', tempDetails.name)
			@options.provider.attr('address', tempDetails.address)
			@options.provider.attr('phoneNumber', tempDetails.phoneNumber)

		destroy : ->
			can.Control.prototype.destroy.call @