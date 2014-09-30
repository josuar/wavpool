WavPool.Views.CommentNew = Backbone.View.extend({
  template: JST['comment/new'],
  
  tagName: "form",
  className: "submission-comment",
  
  initialize: function (options) {
    this.success = options.success;
  },
  
  events: {
    "submit" : "onCommentSubmit"
  },
  
  onCommentSubmit: function (event) {
    event.preventDefault();
    
    var params = $(event.currentTarget).serializeJSON().comment;
    
    params.track_timestamp = WavPool.player.timestamp();
    params.timestamp = params.track_timestamp;
        
    params.track_position = Math.floor(
      (params.timestamp / WavPool.player.duration()) * 100
    );
    params.position = params.track_position;
    
    params.submission_id = this.collection.submission.id;
    
    var callbacks = {
      success: function (comment) {        
        if (this.success) {
          this.success();
        }
        
        comment._profile = WavPool.profile;
        comment.trigger("sync");
        
        this.$('input').val('');
      }.bind(this),
      
      error: function (comment, response) {
        WavPool.alerter.flashNow({
          context: "danger",
          message: response.responseJSON
        });

        this.model.set(submission.attributes);
      }.bind(this),
      
      wait: true
    };
    
    if (this.model.isNew()) {
      this.collection.create(params, callbacks);
    } else {
      this.model.save(params, callbacks);
    }
  },
  
  render: function () {    
    var renderedContent = this.template({
      comment: this.model
    });

    this.$el.html(renderedContent);    

    return this;
  }
});