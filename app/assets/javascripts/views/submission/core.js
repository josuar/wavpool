WavPool.Views.SubmissionCore = Backbone.CompositeView.extend({
  template: JST['submission/core'],
  className: 'core',
  
  initialize: function () {
    this.listenTo(this.model, "sync", this.render);

    this.invertedComments = {};
    
    this._construct();
  },

  events: {
    "click .play-button" : "onPlayClick",
    "click .progress" : "onProgressClick"
  },
  
  render: function () {
    var rendered = this.template({
      submission: this.model
    });
    
    this.$el.html(rendered);
    this.attachSubviews();
    
    return this;
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
        url: this.model.submissionUrl(),
        title: this.model.escape("title"),
        id: this.model.id
      });
      
      this._bindRemote();
      this.bound = true;
    }
  },
  
  onAfterRender: function () {
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

    if (!this.bound && WavPool.player.submissionId() === this.model.id) {
      this._bindRemote();
      this.bound = true;
    }
  },

  _bindRemote: function() {
    WavPool.player.bindRemote({
      $progressBar: this.$('.progress'),
      $playButton: this.$('.play-button'),

      comments: this.invertedComments, 
      
      reset: function () {
        this.bound = false;
        //this.removeCommentForm();
      }.bind(this)
    });
    
    //this.addCommentForm();
  },
  
  _construct: function () {    
    this.addSubview(
      '.header-container',
      new WavPool.Views.SubmissionCoreHeader({ model: this.model })
    );
    
    this.addSubview(
      '.body-container',
      new WavPool.Views.SubmissionCoreBody({ model: this.model })
    );
    
    this.addSubview(
      '.footer-container',
      new WavPool.Views.SubmissionCoreFooter({
        model: this.model,
        showButtonText: true
      })
    );
  }
});