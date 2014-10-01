WavPool.Views.SubmissionCore = Backbone.CompositeView.extend({
  template: JST['submission/core'],
  className: 'core',
  
  initialize: function () {
    //this.listenTo(this.model, "sync", this.render);
    
    this.barComments = {};
    
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
      
      actionUrl: "api/submissions/" + this.model.id + "/like",
      
      onOn: function () {
        // this.model.set("likes", this.model.get("likes") + 1);
      }.bind(this),

      onOff: function () {
        // this.model.set("likes", this.model.get("likes") - 1);
      }.bind(this)
    });

    if (!this.bound && WavPool.player.submissionId() === this.model.id) {
      this._bindRemote();
      this.bound = true;
    }
    
    this.model.comments().each(this._addComment.bind(this));
  },

  _addComment: function (comment) {
    var timestamp = comment.get("track_timestamp");
    var duration = this.model.get("duration") || -1;
    
    var $bar = this.$('.progress');
    
    var place = timestamp / duration;
    var left = $bar.width() * place;
    
    var $line = $('<div>').addClass("comment-line").css("left", left);   
    $bar.append($line);
    
    this.barComments[timestamp] = {
      comment: comment,
      line: $line
    };
  },

  _bindRemote: function() {
    console.log("  core binding remote")
    WavPool.player.bindRemote({
      $progressBar: this.$('.progress'),
      $playButton: this.$('.play-button'),
      
      comments: this.barComments,
      
      reset: function () {
        this.bound = false;
        this._removeCommentForm();
      }.bind(this)
    });
    
    this._addCommentForm();
  },
  
  _addCommentForm: function () {
    this.addSubview(
      '.new-comment-container',
      new WavPool.Views.CommentNew({
        model: new WavPool.Models.Comment(),
        collection: this.model.comments(),
        
        success: function (comment) {
          this._addComment(comment);
        }.bind(this)
      })
    );
  },
  
  _removeCommentForm: function () {
    this.removeSubview(
      ".new-comment-container",
      this.subviews(".new-comment-container")[0]
    );
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