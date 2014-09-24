WavPool.Views.ProfileEdit= Backbone.View.extend({
	template: JST["profile/edit"],
  
  events: {
    "submit form": "onSubmit"
  },
  
  onSubmit: function (event) {
    event.preventDefault();
  },

  render: function () {
    var renderedContent = this.template({
      profile: this.model
    });

    this.$el.html(renderedContent);

    return this;
  }
});