WavPool.Views.SubmissionShow = Backbone.CompositeView.extend({
	template: JST["submission/show"],

	initialize: function (options) {
    this.showDescription = options.showDescription;
    
    this.listenTo(this.model, "sync", this.render);
  },

  render: function () {    
    var renderedContent = this.template({
      submission: this.model,
      showDescription: this.showDescription
    });

    this.$el.html(renderedContent);

    return this;
  }
});