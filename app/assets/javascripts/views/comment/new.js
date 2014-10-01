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
    
    var duration = Math.floor(WavPool.player.duration());  
    var params = $(event.currentTarget).serializeJSON().comment;
    
    params.track_timestamp = WavPool.player.timestamp();
    params.submission_id = this.collection.submission.id;
    
    var callbacks = {
      success: function (comment) {    
        if (!this.collection.submission.has("duration")) {
          this.collection.submission.set("duration", duration);
          this.collection.submission.save(null, { silent: true });
        }        
        
        this.$('input').val('');
        
        if (this.success) {
          this.success(comment);
        }
      }.bind(this),
      
      error: function (comment, response) {
        WavPool.alerter.flashNow({
          context: "danger",
          message: response.responseJSON
        });

        this.model.set(comment.attributes);
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