(function() {
  var Helpers;

  Helpers = {};

  Helpers.showMessage = function(type, message) {
    return noty({
      text: message,
      type: type,
      layout: 'bottomLeft',
      timeout: 2500,
      theme: 'relax',
      animation: {
        open: 'animated bounceInLeft',
        close: 'animated bounceOutLeft'
      }
    });
  };

  window.Helpers = Helpers;

}).call(this);
