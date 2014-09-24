WavPool.Routers.ProfileRouter = Backbone.SwappingRouter.extend({
  routes: {
    "profiles/:id" : "show",
    "profile/edit" : "edit"
  },

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
  },
  
  show: function (id) {
    var profile = WavPool.profiles.getOrFetch(id);

    var view = new WavPool.Views.ProfileShow({
    	model: profile
    });

    this._swapView(view);
  },
  
  edit: function () {
    
  }
});