WavPool.Views.SubmissionShow = Backbone.CompositeView.extend({
	template: JST["submission/show"],

	initialize: function (options) {
    this.showDescription = options.showDescription || false;
    this.showProfile = options.showProfile || false;
    this.showComments = options.showComments || false;
    
    this.invertedComments = {};
    
    this.listenTo(this.model, "sync change", this.render);   
    this.listenTo(this.model.comments(), "remove", this.removeComment);
    
    if (this.showComments) {
      this.listenTo(this.model.comments(), "add", this.addComment);
      this.model.comments().each(this.addComment.bind(this));
    }
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
    var subview = new WavPool.Views.CommentShow({
      model: comment
    });

    this.addSubview('.comments', subview);
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
    if (WavPool.player.submissionId() === this.model.id) {
      this._bindRemote();
      this.bound = true;
    }
    
    this.$('.comment-line').remove();
    this.invertedComments = {};
    
    this.model.comments().each(this._addCommentLine.bind(this));
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