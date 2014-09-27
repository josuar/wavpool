WavPool.Views.SubmissionShow = Backbone.CompositeView.extend({
	template: JST["submission/show"],

	initialize: function (options) {
    this.showDescription = options.showDescription;
    this.showProfile = options.showProfile;
    
    this.listenTo(this.model, "sync change", this.render);
  },

  render: function () {    
    var renderedContent = this.template({
      submission: this.model,
      showDescription: this.showDescription,
      showProfile: this.showProfile
    });

    this.$el.html(renderedContent);

    this.$('.like-button').toggleButton({      
      onAction: "Like",
      offAction: "Unlike",

      noText: true,
      buttonStyle: "default",
      onClass: "liked",
      
      on: this.model.get("liked"),
      
      onIcon: "heart",
      offIcon: "heart",
      
      actionUrl: "api/submissions/" + this.model.id + "/like"
    });

    return this;
  }
});