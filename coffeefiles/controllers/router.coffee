'use strict'

require ['bootstrap'], (bootstrap) ->

    Router = can.Control.extend

        init : (element, options) ->

        'route' : (data) ->
            can.route.attr( page : 'home')
        'home route' : (data) ->

        'destroyControllers' : ->
            currentControllers = can.$('.main-container').data().controls
            @destroyController controller for controller in currentControllers

        'destroyController' : (controller) ->
            if controller? then controller.destroy()

    $(document).ready ->
        can.route.ready();
