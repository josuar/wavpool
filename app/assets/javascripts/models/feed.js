WavPool.Models.Feed = Backbone.Model.extend({
  urlRoot: "api/feed",
  
  submissions: function () {
    this._submissions = this._submissions ||
      new WavPool.Collections.Submissions([]);
      
    return this._submissions;
  },
  
  recentLikes: function () {
    this._recentLikes = this._recentLikes ||
      new WavPool.Collections.Submissions([]);
      
    return this._recentLikes;
  },
  
  recommendedUsers: function () {
    this._recommendedUsers = this._recommendedUsers ||
      new WavPool.Collections.Profiles([]);
      
    return this._recommendedUsers;
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
    
    if (payload.recommended_users) {
      this.recommendedUsers().set(payload.recommended_users, { parse: true } );
      delete payload.recommended_users;
    }
    
    return payload;
  }
});