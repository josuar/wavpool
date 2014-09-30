WavPool.Models.Comment = Backbone.Model.extend({
  urlRoot: 'api/comments',
  
  profile: function () {
    this._profile = this._profile ||
      new WavPool.Models.Profile();
      
    return this._profile;
  },
  
  parse: function (payload) {
    if (payload.profile) {
      this.profile().set(payload.profile, { parse: true } );
      delete payload.profile;
    }
    
    return payload;
  },
  
  timestamp: function () {
    var time = this.get("timestamp");
    
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    
    return (pad(minutes, 2) + ":" + pad(seconds, 2));
    
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