WavPool.Models.Submission = Backbone.Model.extend({
  urlRoot: '/api/submissions',
  
  submitter: function () {
    this._submitter = this._submitter || new WavPool.Models.Profile();
    
    return this._submitter;
  },
  
  parse: function (payload) {
    if (payload.submitter) {
      this.submitter().set(payload.submitter, { parse: true });     
      delete payload.submitter;
    }
    
    return payload;
  },
  
  imageUrl: function () {
    return WavPool.s3Url(this.escape("image_url"));
  },
  
  submissionUrl: function () {
    return WavPool.s3Url(this.escape("remote_url"));
  },
  
  permalink: function () {
    return this.urlRoot + this.id;
  }
});