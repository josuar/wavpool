WavPool.Views.SubmissionShow = Backbone.CompositeView.extend({
	template: JST["submission/show"],

	initialize: function (options) {
    this.showDescription = options.showDescription;
    this.showProfile = options.showProfile;
    
    this.listenTo(this.model, "sync change", this.render);
  },

  events: {
    "click .play-button" : "onPlayClick"
  },

  onPlayClick: function (event) {
    event.preventDefault();

    if (this.bound) {
      WavPool.player.togglePlayState();
    } else {
      WavPool.player.bindRemote({
        $progressBar: this.$('.progress'),
        $playButton: this.$('.play-button')
      });

      WavPool.player.playTrack({
        url: WavPool.s3Url(this.model.get("remote_url")),
        title: this.model.escape("title"),
        id: this.model.id
      });

      this.bound = true;
    }
  },

  onRender: function () {
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

    if (WavPool.player.submissionId() === this.model.id) {
      WavPool.player.bindRemote({
        $progressBar: this.$('.progress'),
        $playButton: this.$('.play-button')
      });

      this.bound = true;
    }
  },

  render: function () {    
    var renderedContent = this.template({
      submission: this.model,
      showDescription: this.showDescription,
      showProfile: this.showProfile
    });

    this.$el.html(renderedContent);    

    return this;
  }
});