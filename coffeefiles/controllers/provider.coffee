'use strict'

define ['can', 'models/providerModels'], (can, ProviderModel) ->

	Provider = can.Control.extend

		init : (element, options) ->
			@initControllerOptions()
			@renderCorrectTemplate()

		'#create-prov click' : (el) ->
			@createProvider()
			@cleanMaps()
			
		'#delete-prov click' : (el) ->
			#make request to delete provider
		'#update-prov click' : (el) ->
			#make request to update provider
		'#cancel-prov click' : (el) ->
			@cleanMaps()

		initControllerOptions : ->
			@options.searchFilter = can.compute ''
			@options.provider = new can.Map
				name : ''
				address : ''
				phoneNumber : ''
				contact : ''

			@options.providerEdit = new can.Map
				_id : ''
				name : ''
				address : ''
				phoneNumber : ''
				contact : ''

		renderCorrectTemplate : ->
			if @options.edit isnt undefined and @options.edit is true
				if can.route.attr('proveedorid') isnt undefined
					@getProviderDetails can.route.attr('proveedorid')
				@element.html can.view('views/param/param-provider-edit.mustache',
					provider : @options.providerEdit
					searchFilter : @options.searchFilter)
			else
				@element.html can.view('views/param/param-provider.mustache', 
					provider : @options.provider)

		cleanMaps : ->
			@options.provider.attr 'name', ''
			@options.provider.attr 'address', ''
			@options.provider.attr 'phoneNumber', ''

			@options.providerEdit.attr '_id', ''
			@options.providerEdit.attr 'name', ''
			@options.providerEdit.attr 'address', ''
			@options.providerEdit.attr 'phoneNumber', ''

		createProvider : ->
			deferred = ProviderModel.create(@options.provider.serialize())

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'Proveedor creado exitosamente'
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al crear proveedor, favor intentar de nuevo'
			
		getProviderDetails : (providerId)->
			deferred = ProviderModel.findOne(_id:providerId)	

			deferred.then (response) ->
				if response.success is true
					@options.providerEdit.attr '_id', response._id
					@options.providerEdit.attr 'name', response.name
					@options.providerEdit.attr 'address', response.address
					@options.providerEdit.attr 'phoneNumber', response.phoneNumber
					@options.providerEdit.attr 'contact', response.contact
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al traer detalles de proveedor, favor intentar de nuevo'

		destroy : ->
			can.Control.prototype.destroy.call @