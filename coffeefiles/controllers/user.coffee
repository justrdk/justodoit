'use strict'

define ['can', 'models/userModels', 'models/roleModels'], (can, UserModel, RoleModel) ->

	User = can.Control.extend

		init : (element, options) ->
			self = @
			@initControllerOptions()

			can.when(@getRoles()).then (response) ->
				if self.options.edit isnt undefined and self.options.edit is true
					self.renderEditTemplate()
				else
					self.renderCreateTemplate()

		'#create-user click' : (el) ->
			@createUser()

		'#delete-user click' : (el) ->
			if @userSelected() is true
				@deleteUser()
			else
				Helpers.showMessage 'warning', 'No hay usuarios seleccionados para borrar!'
		'#update-user click' : (el) ->
			if @userSelected() is true
				@updateUser()
			else
				Helpers.showMessage 'warning', 'No hay usuarios seleccionados para actualizar!'

		'#cancel-user click' : (el) ->
			@cleanMaps()

		'.typeahead typeahead:autocompleted' : (el, ev, obj, dataset) ->
			el.typeahead 'close'
			@getUserDetails obj._id

		'.typeahead typeahead:selected' : (el, ev, obj, dataset) ->
			@getUserDetails obj._id

		initControllerOptions : ->
			@options.usersList = new can.List []
			@options.roles = new can.List []
			@options.user = new can.Map
				username : ''
				password : ''
				firstname : ''
				lastname : ''
				roleId : ''

			@options.userEdit = new can.Map
				_id : ''
				username : ''
				password : ''
				firstname : ''
				lastname : ''
				roleId: ''

		cleanMaps : ->
			@options.user.attr 'username', ''
			@options.user.attr 'password', ''
			@options.user.attr 'firstname', ''
			@options.user.attr 'lastname', ''

			@options.userEdit.attr '_id', ''
			@options.userEdit.attr 'username', ''
			@options.userEdit.attr 'password', ''
			@options.user.attr 'firstname', ''
			@options.user.attr 'lastname', ''

		userSelected : ->
			if @options.userEdit._id then true else false

		renderCreateTemplate : ->
			@element.html can.view('views/param/param-user.mustache',
					user : @options.user
					roles: @options.roles)

		renderEditTemplate : ->
			self = @
			can.when(@getAllUsers()).then ->
				if can.route.attr('userid') isnt undefined
					self.getUserDetails can.route.attr('userid')
				self.element.html can.view('views/param/param-user-edit.mustache',
					user : self.options.userEdit
					roles: self.options.roles)
				self.initSearchAutoComplete()

		initSearchAutoComplete : ->
			self = @
			can.$('.typeahead').typeahead
				hint: true
				highlight: true
			,
				name : 'Usuarios'
				displayKey: 'value'
				source: self.filterUsers()

		filterUsers : ->
			self = @
			findMatches = (q, cb) ->
				matches = []
				substrRegex = new RegExp(q, 'i')
				users = self.options.usersList

				matches.push {value:username, _id:_id} for {username, _id} in users when substrRegex.test(username) is true
				cb(matches)

		updateUserInList : ->
			user.attr('username', @options.userEdit.username) for user in @options.usersList when user._id is @options.userEdit._id

		removeUserInList : ->
			for user, index in @options.usersList
				if user._id is @options.userEdit._id
					@options.usersList.splice index, 1
					break

		createUser : ->
			self = @
			deferred = UserModel.create(@options.user.serialize())

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'Usuario creado exitosamente'
					self.cleanMaps()
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				if xhr.status is 403
					Helpers.showMessage 'error', 'Su usuario no tiene privilegios para acceder a esta informacion'
				else
					Helpers.showMessage 'error', 'Error al crear usuario, favor intentar de nuevo'

		updateUser : ->
			self = @
			deferred = UserModel.update(@options.userEdit.serialize())

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'Usuario actualizado exitosamente'
					self.updateUserInList()
					self.cleanMaps()
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				if xhr.status is 403
					Helpers.showMessage 'error', 'Su usuario no tiene privilegios para acceder a esta informacion'
				else
					Helpers.showMessage 'error', 'Error al actualizar usuario, favor intentar de nuevo'

		deleteUser : ->
			self = @
			deferred = UserModel.destroy(_id:@options.userEdit._id)

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'Usuario borrado exitosamente'
					self.removeUserInList()
					self.cleanMaps()
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				if xhr.status is 403
					Helpers.showMessage 'error', 'Su usuario no tiene privilegios para acceder a esta informacion'
				else
					Helpers.showMessage 'error', 'Error al intentar borrar usuario, favor intentar de nuevo'

		getAllUsers : ->
			self = @
			deferred = UserModel.findAll({})

			deferred.then (response) ->
				if response.success is true
					self.options.usersList.replace response
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				if xhr.status is 403
					Helpers.showMessage 'error', 'Su usuario no tiene privilegios para acceder a esta informacion'
				else
					Helpers.showMessage 'error', 'Error consiguiendo lista de usuarios, favor intentar de nuevo'

			deferred

		getUserDetails : (userId) ->
			self = @
			deferred = UserModel.findOne(_id:userId)

			deferred.then (response) ->
				if response.success is true
					self.options.userEdit.attr '_id', response.data._id
					self.options.userEdit.attr 'username', response.data.username
					self.options.userEdit.attr 'password', response.data.password
					self.options.userEdit.attr 'firstname', response.data.firstname
					self.options.userEdit.attr 'lastname', response.data.lastname
					self.options.userEdit.attr 'roleId', response.data.roleId
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al traer detalles de usuario, favor intentar de nuevo'

		getRoles : ->
			self = @
			deferred = RoleModel.findAll({})

			deferred.then (response) ->
				if response.success is true
					self.options.roles.replace response
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				if xhr.status is 403
					Helpers.showMessage 'error', 'Su usuario no tiene privilegios para acceder a esta informacion'
				else
					Helpers.showMessage 'error', 'Error al traer los roles, favor intentar de nuevo'

		destroy : ->
			can.$('typeahead').typeahead 'destroy'
			can.Control.prototype.destroy.call @
