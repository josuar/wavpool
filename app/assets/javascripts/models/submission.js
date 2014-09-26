WavPool.Models.Submission = Backbone.Model.extend({
  urlRoot: "api/submissions",

  imageUrl: function () {
    if (this.attributes.image_url) {
      return this.escape("image_url");
    } else {
      return 'default.png';
    }
  }
});