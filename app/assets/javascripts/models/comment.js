WavPool.Models.Comment = Backbone.Model.extend({
  urlRoot: 'api/comments',
  
  profile: function () {
    this._profile = this._profile ||
      new WavPool.Models.Profile();
      
    return this._profile;
  },
  
  submission: function () {
    this._submission = this._submission ||
      new WavPool.Models.Submission();
      
    return this._submission;
  },
  
  parse: function (payload) {
    if (payload.profile) {
      this.profile().set(payload.profile, { parse: true } );
      delete payload.profile;
    }
    
    if (payload.submission) {
      this.submission().set(payload.submission, { parse: true } );
      delete payload.submission;
    }
    
    return payload;
  },
  
  readableTimestamp: function () {
    var time = this.get("track_timestamp");
    
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    
    return pad(minutes, 2) + ":" + pad(seconds, 2);
    
    function pad(number, width) {
      number = number + '';
      
      if (number.length >= width) {
        return number;
      } else {
        return new Array(width - number.length + 1).join('0') + number;
      }
    }
  }
});