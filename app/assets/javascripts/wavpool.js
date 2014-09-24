window.WavPool = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  initialize: function (isAuthed) {
    this.isAuthed = isAuthed;

    this.startRouters({
    	$rootEl: $('main')
    });

    Backbone.history.start();
  },

  startRouters: function (options) {
  	new WavPool.Routers.RootRouter(options);
  	new WavPool.Routers.ProfileRouter(options);
  }
};