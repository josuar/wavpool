WavPool.Collections.Comments = Backbone.Collection.extend({  
  model: WavPool.Models.Comment,
  
  comparator: function (comment) {
    return comment.get("timestamp");
  }
});