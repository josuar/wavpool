$.InfiniteLoader = function (el, url, dataName, callback) {
  this.$el = $(el);
  
  this.url = url;
  this.callback = callback;
  this.dataName = dataName;
  
  this.nextPage = 2;
  
  this._bindScroll();
};

$.InfiniteLoader.prototype.fetch = function (event) {  
  $.ajax({
    url: this._buildUrl(),
    type: "GET",
    dataType: "JSON",  
    success: function (data) {
      this.callback(data);
      
      if (data[this.dataName].length > 0) {
        this.nextPage++;
      }
    }.bind(this)
  });
};

$.InfiniteLoader.prototype._buildUrl = function () {
  return this.url + "?page=" + this.nextPage;
};

$.InfiniteLoader.prototype._bindScroll = function (event) {
  this.$el.bind('scroll', function () {
    var $el = this.$el;
  
    if($el.scrollTop() + $el.innerHeight() >= $el.get(0).scrollHeight) {
      this.fetch();
    }
  }.bind(this));
};

$.fn.infiniteLoader = function (url, dataName, callback) {
  return this.each(function () {
    new $.InfiniteLoader(this, url, dataName, callback);
  });
};