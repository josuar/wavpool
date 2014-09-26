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
      return "an unknown date";
    }
    
    var date = new Date(this.get("timestamp"));
    
    return date.toLocaleString();
  }
});