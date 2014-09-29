WavPool.Views.SubmissionShow = Backbone.CompositeView.extend({
	template: JST["submission/show"],

	initialize: function (options) {
    this.showDescription = options.showDescription;
    this.showProfile = options.showProfile;
    
    this.listenTo(this.model, "sync change", this.render);
  },

  events: {
    "click .play-button" : "onPlayClick",
    "click .progress" : "onProgressClick"
  },
  
  onProgressClick: function (event) {
    if (!this.bound) {
      return;
    }
    
    var $bar = $(event.currentTarget);    
    WavPool.player.seek(event.offsetX, $bar.width());
  },

  onPlayClick: function (event) {
    event.preventDefault();

    if (this.bound) {
      WavPool.player.togglePlayState();
    } else {
      WavPool.player.playTrack({
        url: WavPool.s3Url(this.model.get("remote_url")),
        title: this.model.escape("title"),
        id: this.model.id
      });
      
      this._bindRemote();

      this.bound = true;
    }
  },
  
  _bindRemote: function() {
    WavPool.player.bindRemote({
      $progressBar: this.$('.progress'),
      $playButton: this.$('.play-button'),
      reset: function () {
        this.bound = false;
      }.bind(this)
    });
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
      this._bindRemote();
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