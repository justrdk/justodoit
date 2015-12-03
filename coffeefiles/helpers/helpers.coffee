Helpers = {}

Helpers.showMessage = (type, message) ->
	noty
	    text: message
	    type: type
	    layout: 'bottomRight'
	    timeout: 2500
	    theme: 'relax'
	    animation: 
	        open: 'animated bounceInLeft'
	        close: 'animated bounceOutLeft'

window.Helpers = Helpers
