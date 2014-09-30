WavPool.Views.SubmissionShow = Backbone.CompositeView.extend({
	template: JST["submission/show"],

	initialize: function (options) {
    this.showDescription = options.showDescription;
    this.showProfile = options.showProfile;
    
    this.invertedComments = {};
    
    this.listenTo(this.model, "sync change", this.render);   
    this.listenTo(this.model.comments(), "add", this.addComment);
  },
  
  className: "submission",

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
  
  addComment: function (comment) {
    this._addCommentLine(comment);
    
    // var subview = new WavPool.Views.CommentShow({
    //   model: comment
    // });
    //
    // this.addSubview('.comments', subview);
  },
  
  removeCommentForm: function () {
    this.removeSubview(
      ".comment-placeholder",
      this.subviews(".comment-placeholder")[0]
    );
  },
  
  addCommentForm: function () {
    var subview = new WavPool.Views.CommentNew({
      model: new WavPool.Models.Comment(),
      collection: this.model.comments()
    });
    
    this.addSubview(".comment-placeholder", subview);
  },
  
  _bindRemote: function() {
    WavPool.player.bindRemote({
      $progressBar: this.$('.progress'),
      $playButton: this.$('.play-button'),
      $analyzer: this.$('.analyzer'), 
      comments: this.invertedComments, 
      reset: function () {
        this.bound = false;
        this.removeCommentForm();
      }.bind(this)
    });
    
    this.addCommentForm();
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
    
    this.model.comments().each(this.addComment.bind(this));
  },
  
  _addCommentLine: function (comment) {
    var $bar = this.$('.track-progress');
    var $line = $('<div>').addClass("comment-line");
    
    var left = Math.floor(
      (comment.get("position") / 100) * $bar.width()
    );
    
    $line.css("left", left);
    $bar.append($line);
    
    this._invertComment(comment, $line);
  },
  
  _invertComment: function (comment, line) {
    var timestamp = comment.get("timestamp");   
    
    this.invertedComments[timestamp] = this.invertedComments[timestamp] || [];
    this.invertedComments[timestamp].push({
      comment: comment,
      line: line
    }); 
  },

  render: function () {    
    var renderedContent = this.template({
      submission: this.model,
      showDescription: this.showDescription,
      showProfile: this.showProfile
    });
    
    this.invertedComments = {};

    this.$el.html(renderedContent);   
    this.attachSubviews(); 

    return this;
  }
});