window.WavPool = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  initialize: function (isAuthed, profileId) {
    this.isAuthed = isAuthed;
    this.profileId = profileId;
    
    this.alertView = new WavPool.Views.Alert();

    this.startRouter({
    	$rootEl: $('main')
    });

    Backbone.history.start();
  },
  
  alert: function (alert) {
    this.alertView.clear();
    this.alertView.set(alert);
  },

  startRouter: function (options) {
  	var router = new WavPool.Routers.Router(options);
    
    router.on('route', function () {
      this.alertView.clear();
    }.bind(this));
  }
};