WavPool.Models.Profile = Backbone.Model.extend({
  urlRoot: '/api/profiles/',
  
  submissions: function () {
    this._submissions = this._submissions ||
      new WavPool.Collections.Submissions([], { profile: this });
    
    return this._submissions;
  },
  
  recentLikes: function () {
    this._recentLikes = this._recentLikes ||
      new WavPool.Collections.Submissions([], { profile: this });
      
    return this._recentLikes;
  },
  
  recentComments: function () {
    this._recentComments = this._recentComments ||
      new WavPool.Collections.Comments([], {});
      
    return this._recentComments;
  },
  
  parse: function (payload) {
    if (payload.submissions) {
      this.submissions().set(payload.submissions, { parse: true } );
      delete payload.submissions;
    }
    
    if (payload.recent_likes) {
      this.recentLikes().set(payload.recent_likes, { parse: true } );
      delete payload.recent_likes;
    }
    
    if (payload.recent_comments) {
      this.recentComments().set(payload.recent_comments, { parse: true } );
      delete payload.recent_comments;
    }
    
    return payload;
  },
  
  isCurrentUser: function () {
    return WavPool.user && WavPool.user.profile().id === this.id;
  },
  
  pictureUrl: function () {
    return WavPool.s3Url(this.escape("picture_url"));
  },
  
  showLink: function () {
    return "/#/profiles/" + this.id;
  },
  
  editLink: function () {
    return "#/profile/edit";
  },
  
  apiUrl: function () {
    return this.urlRoot + this.id;
  }
});