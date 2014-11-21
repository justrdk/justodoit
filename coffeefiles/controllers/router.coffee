'use strict'

require ['bootstrap', 'can'], (bootstrap, can) ->

    Router = can.Control.extend

        init : (element, options) ->
            alert('router')
        'route' : (data) ->
            window.location.hash = '#!home'

        'home route' : (data) ->
            console.log('here');

        'destroyControllers' : ->
            currentControllers = can.$('.main-container').data().controls
            @destroyController controller for controller in currentControllers

        'destroyController' : (controller) ->
            if controller? then controller.destroy()

    $(document).ready ->
        new Router($('body'))
        can.route.ready();