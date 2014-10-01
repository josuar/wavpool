WavPool.Models.Profile = Backbone.Model.extend({
  urlRoot: '/api/profiles/',
  
  submissions: function () {
    this._submissions = this._submissions ||
      new WavPool.Collections.Submissions([], { profile: this });
    
    return this._submissions;
  },
  
  parse: function (payload) {
    if (payload.submissions) {
      this.submissions().set(payload.submissions, { parse: true } );
      delete payload.submissions;
    }
    
    return payload;
  },
  
  isCurrentUser: function () {
    return WavPool.user && WavPool.user.profile().id === this.id;
  },
  
  pictureUrl: function () {
    return WavPool.s3Url(this.escape("picture_url"));
  },
  
  link: function () {
    return this.urlRoot + this.id;
  }
});