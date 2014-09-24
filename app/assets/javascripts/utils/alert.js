WavPool.Views.Alert = Backbone.View.extend({
  set: function (alert) {
    if (!alert.message) {
      alert.message = "An unknown error occurred. Your connection with WavPool may have been interrupted.";
    }
    
    this._alerts().append(
      $('<div>').addClass("alert alert-" + alert.context).text(alert.message)
    );
  },
  
  clear: function () {
    $('.inline-alerts').empty();
    $('.alerts').empty();
  },
  
  _alerts: function () {
    var $inlineAlerts = $('.inline-alerts'); 
    return $inlineAlerts.length ? $inlineAlerts : $('.alerts');
  }
});