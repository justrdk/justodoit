'use strict'

define ['can', 'scripts/loginModel'], (can, LoginModel) ->

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
						can.route.attr 'route', 'home'
				, (xhr) ->
					Helpers.showMessage 'error', 'Error al tratar de iniciar sesion, favor intentar de nuevo'
