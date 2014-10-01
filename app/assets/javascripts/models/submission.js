WavPool.Models.Submission = Backbone.Model.extend({
  urlRoot: '/api/submissions/',
  
  submitter: function () {
    this._submitter = this._submitter || new WavPool.Models.Profile();
    
    return this._submitter;
  },
  
  comments: function () {
    this._comments = this._comments ||
      new WavPool.Collections.Comments([], { submission: this });
      
    return this._comments;
  },
  
  parse: function (payload) {
    if (payload.submitter) {
      this.submitter().set(payload.submitter, { parse: true });     
      delete payload.submitter;
    }
    
    if (payload.comments) {
      this.comments().set(payload.comments, { parse: true });
      delete payload.comments;
    }
    
    return payload;
  },
  
  imageUrl: function () {
    return WavPool.s3Url(this.escape("image_url"));
  },
  
  submissionUrl: function () {
    return WavPool.s3Url(this.escape("remote_url"));
  },
  
  showLink: function () {
    return "/#/submissions/" + this.id;
  },
  
  editLink: function () {
    return "/#/submission/" + this.id + "/edit";
  }
});