WavPool.Views.SubmissionShow = Backbone.CompositeView.extend({
	template: JST["submission/show"],

	initialize: function (options) {
    this.showExtendedInfo = options.showExtendedInfo;
    
    this.listenTo(this.model, "sync change", this.render);
  },

  render: function () {    
    var renderedContent = this.template({
      submission: this.model,
      showExtendedInfo: this.showExtendedInfo
    });

    this.$el.html(renderedContent);
    return this;
  }
});