'use strict'

require ['can', 'helpers/helpers','controllers/product', 'controllers/provider',
'controllers/inventory','controllers/saleorder', 'controllers/isv', 'controllers/salesdetails',
'models/loginModels', 'components/loginComponent', 'components/headerComponent'],
(can, Helpers, Product, Provider, Inventory, SaleOrder, ISV, SalesDetails, LoginModel) ->

	Router = can.Control.extend

		init : (element, options) ->
			@options.userMap = new can.Map(
					user : {})

			@watchRouteChanges()
			@renderHeader()

		watchRouteChanges : ->
			self = @
			can.route.bind 'change', (ev, attr, how, newVal, oldVal) ->
				if newVal isnt 'login'
					can.$('.top-menu').removeClass 'hidden'
					self.checkUserAuthentication()

		renderHeader : ->
			headerComponent = can.mustache '<navbar-element usermap="user"></navbar-element>'
			can.$('.top-menu').html headerComponent(
				user: @options.userMap)


		checkUserAuthentication : ->
			self = @
			deferred = LoginModel.findOne()

			deferred.then (response) ->
				if response.success is false
					can.route.attr 'route', 'login'
				else
					self.options.userMap.attr 'user', response
			,(xhr) ->
				Helpers.showMessage 'error', 'Error desconocido, favor intentar de nuevo'

		'route' : (data) ->
			can.route.attr 'route', 'login'

		'login route' : (data) ->
			can.$('.top-menu').addClass 'hidden'
			component = can.mustache '<login-form></login-form>'
			can.$('.main-container').html component()

		'crearProducto route' : (data) ->
			@destroyControllers()
			new Product(can.$('.main-container'), edit:false)

		'editarProducto route' : (data) ->
			@destroyControllers()
			new Product(can.$('.main-container'), edit:true)

		'editarProducto/:productoid route' : (data) ->
			@destroyControllers()
			new Product(can.$('.main-container'), edit:true)

		'crearProveedor route' : (data) ->
			@destroyControllers()
			new Provider(can.$('.main-container'), edit:false)

		'editarProveedor route' : (data) ->
			@destroyControllers()
			new Provider(can.$('.main-container'), edit:true)

		'editarProveedor/:proveedorid route' : (data) ->
			@destroyControllers()
			new Provider(can.$('.main-container'), edit:true)

		'inventario route' : (data) ->
			@destroyControllers()
			new Inventory(can.$('.main-container'))

		'venta route' : (data) ->
			@destroyControllers()
			new SaleOrder(can.$('.main-container'))

		'editarISV route' : (data) ->
			@destroyControllers()
			new ISV(can.$('.main-container'))

		'detallesVenta route' : (data) ->
			@destroyControllers()
			new SalesDetails(can.$('.main-container'))

		'destroyControllers' : ->
			currentControllers = can.$('.main-container').data().controls
			if currentControllers isnt undefined
				@destroyController controller for controller in currentControllers

		'destroyController' : (controller) ->
			if controller isnt undefined and controller isnt null
				controller.destroy()

	$(document).ready ->
		new Router($('body'))
		can.route.ready()
