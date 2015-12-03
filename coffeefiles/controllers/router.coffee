'use strict'

require ['can', 'helpers/helpers','controllers/product', 'controllers/provider', 'controllers/user',
'controllers/inventory','controllers/saleorder', 'controllers/isv', 'controllers/salesdetails',
'models/loginModels', 'models/logoutModels', 'components/loginComponent', 'components/headerComponent'],
(can, Helpers, Product, Provider, User, Inventory, SaleOrder, ISV, SalesDetails, LoginModel, LogoutModel) ->

	Router = can.Control.extend

		init : (element, options) ->
			@options.userMap = new can.Map(
					user : {})

			@watchRouteChanges()

		watchRouteChanges : ->
			self = @
			can.route.bind 'change', (ev, attr, how, newVal, oldVal) ->
				if can.route.attr('route') isnt 'login' and can.route.attr('route') isnt undefined
					self.checkUserAuthentication  can.route.attr 'route'

		renderHeader : ->
			headerComponent = can.mustache '<navbar-element usermap="user"></navbar-element>'
			can.$('#main-wrapper').prepend headerComponent(
				user: @options.userMap)

		checkUserAuthentication : (routeValue) ->
			self = @
			deferred = LoginModel.findOne()
			adminRoutes = ['crearProducto', 'editarProducto', 'crearProveedor', 'editarProveedor', 'crearUsuario', 'editarUsuario', 'inventario', 'editarISV', 'detallesVenta']

			deferred.then (response) ->
				if response.success is false
					can.route.attr 'route', 'login'
				else
					if response.roleId is 2 and routeValue in adminRoutes
						LogoutModel.findOne().then (response) ->
							if response.success is true
								can.route.attr({route: 'login'}, true)
					
					else if can.$('navbar-element').length is 0
						self.options.userMap.attr 'user', response
						self.renderHeader()
					
			,(xhr) ->
				Helpers.showMessage 'error', 'Error desconocido, favor intentar de nuevo'

		'route' : (data) ->
			LogoutModel.findOne()
			can.route.attr({route: 'login'}, true)

		'login route' : (data) ->
			can.$('navbar-element').remove()
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

		'crearUsuario route' : (data) ->
			@destroyControllers()
			new User(can.$('.main-container'), edit:false)

		'editarUsuario route' : (data) ->
			@destroyControllers()
			new User(can.$('.main-container'), edit:true)

		'editarUsuario/:userid route' : (data) ->
			@destroyControllers()
			new User(can.$('.main-container'), edit:true)

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
			if currentControllers?
				@destroyController controller for controller in currentControllers

		'destroyController' : (controller) ->
			if controller?
				controller.destroy()

	$(document).ready ->
		new Router($('body'))
		can.route.ready()
