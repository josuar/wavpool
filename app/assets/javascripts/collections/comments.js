WavPool.Collections.Comments = Backbone.Collection.extend({  
  url: 'api/comments/',
  model: WavPool.Models.Comment,
  
  initialize: function (models, options) {
    this.submission = options.submission || null;
  },
  
  comparator: function (comment) {
    return -comment.id;
  }
});