WavPool.Views.ProfileShow = Backbone.CompositeView.extend({
	template: JST["profile/show"],

	initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },

  render: function () {
    var renderedContent = this.template({
      profile: this.model
    });

    this.$el.html(renderedContent);

    return this;
  }
});