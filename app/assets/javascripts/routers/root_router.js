WavPool.Routers.RootRouter = Backbone.SwappingRouter.extend({
  routes: {
    "" : "root"
  },

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
  },
  
  root: function () {
  }
});