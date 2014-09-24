WavPool.Routers.ProfileRouter = Backbone.SwappingRouter.extend({
  routes: {
    "profiles/:id/" : "show",
    "profile/edit" : "edit"
  },
  
  show: function (id) {
    var profile = WavPool.profiles.getOrFetch(id);
  },
  
  edit: function () {
    
  }
});