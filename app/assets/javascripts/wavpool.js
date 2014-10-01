window.WavPool = {
  Models:      {},
  Collections: {},
  Views:       {},
  Routers:     {},
  
  initialize: function (options) {
    if (options.userId > 0) {
      this.user = new WavPool.Models.User();
      this.user.fetch({
        success: this._start.bind(this)
      });
    } else {
      this.user = null;
    }
    
    this.s3Bucket = options.s3Bucket;
    
    this.alerter = $('.alerts').alerter();
    this.player = $('.global-player').audioPlayer();
    
    if (!this.user) {
      this._start();
    } 
  },
  
  s3Url: function (url) {
    if (url === '') {
      return '';
    }
    
    return this.s3Bucket + url;
  },
  
  pageNotFound: function () {   
    this.alerter.flash({
      context: "danger",
      message: "An error occurred loading the page."
    });

    Backbone.history.navigate('/', {
      trigger: true,
      replace: true
    });
  },
  
  _start: function () {
    var router = new WavPool.Routers.Router({
      $rootEl: $('main')
    });

    router.on('route', function () {
      this.alerter.renderDeferred();
    }.bind(this));
    
    Backbone.history.start();
  }
};

$(document).ajaxError(function (event, xhr) {
  if (xhr.status === 404) {
    WavPool.pageNotFound();
  }
});