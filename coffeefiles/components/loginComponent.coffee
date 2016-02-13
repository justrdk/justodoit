'use strict'

define ['can', 'models/loginModels'], (can, LoginModel) ->

	can.Component.extend
		tag : 'login-form'
		template : can.view 'views/shared/login.mustache'
		scope :
			user :
				username : ''
				password : ''

			login : (ev, el) ->
				deferred = LoginModel.create(@attr('user').serialize())
				deferred.then (response) ->
					if response.success is true
						can.route.attr 'route', 'venta'
					else
						Helpers.showMessage 'error', response.errorMessage
				, (xhr) ->
					Helpers.showMessage 'error', 'Error al tratar de iniciar sesion, favor intentar de nuevo'
