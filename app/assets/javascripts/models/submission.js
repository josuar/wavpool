WavPool.Models.Submission = Backbone.Model.extend({
  urlRoot: "api/submissions",

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
  }
});