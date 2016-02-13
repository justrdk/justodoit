'use strict'

define ['can', 'models/logoutModels'], (can, LogoutModel) ->

	can.Component.extend
		tag : 'navbar-element'
		template: can.view 'views/shared/header.mustache'
		scope :
			company : 'Libreria Universal'
			logout : ->
				deferred = LogoutModel.findOne()

				deferred.then (response) ->
					if response.success is true
						can.route.attr({route: 'login'}, true)
				, (xhr) ->
					Helpers.showMessage 'error', 'Error al tratar de cerrar sesion, favor intentar de nuevo'
