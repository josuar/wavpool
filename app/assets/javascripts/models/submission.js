WavPool.Models.Submission = Backbone.Model.extend({
  urlRoot: "api/submissions",
  
  comments: function () {
    this._comments = this._comments ||
      new WavPool.Collections.Comments([], { submission: this });
      
    return this._comments;
  },
  
  parse: function (payload) {
    if (payload.comments) {
      this.comments().set(payload.comments, { parse: true } );
      delete payload.comments;
    }
    
    return payload;
  },

  imageUrl: function () {
    if (this.attributes.image_url) {
      return this.escape("image_url");
    } else {
      return 'default.png';
    }
  },
  
  timestamp: function () {
    if (!this.attributes.timestamp) {
      return "some time ago";
    }
    
    return this.escape("timestamp") + " ago";
  },
  
  isOwnedByCurrentUser: function () {
    if (!WavPool.profile) {
      return false;
    }
    
    if (!this.attributes.profile) {
      return false;
    }
    
    return WavPool.profile.id === this.get("profile").id;
  },
  
  getShareUrl: function () {
    var loc = window.location;
    return loc.protocol + "//" + loc.host + "/#/submissions/" + this.id
  }
});