WavPool.Collections.Submissions = Backbone.Collection.extend({
  url: "api/submissions",
  
  model: WavPool.Models.Submission,
  
  comparator: function (left, right) {
    var leftDate = new Date(left.get("timestamp")),
        rightDate = new Date(right.get("timestamp"));
        
    if (leftDate < rightDate) {
      return -1;
    } else if (leftDate === rightDate) {
      return 0;
    } else {
      return 1;
    }
  }
});

WavPool.submissions = new WavPool.Collections.Submissions();