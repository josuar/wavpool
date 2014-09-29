WavPool.Collections.Comments = Backbone.Collection.extend({  
  model: WavPool.Models.Comment,
  
  comparator: function (left, right) {
    var leftDate = new Date(left.get("created_at")),
        rightDate = new Date(right.get("created_at"));
        
    if (leftDate > rightDate) {
      return -1;
    } else if (leftDate === rightDate) {
      return 0;
    } else {
      return 1;
    }
  }
});