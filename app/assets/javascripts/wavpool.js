window.WavPool = {
  Models:      {},
  Collections: {},
  Views:       {},
  Routers:     {},
  
  initialize: function (options) {
    if (options.userId > 0) {
      this.user = new WavPool.Models.User();
      this.feed = new WavPool.Models.Feed();
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
  },
  
  _getUploadPost: function (callback) {
    $.ajax({
      url: "/signed_urls",
      success: callback
    });
  },
  
  bindUploadField: function (options) {
    this._getUploadPost(function (signedPost) {
      var fileTypes = options.fileTypes;
      var $fileInput = options.$fileInput;
      var $previewEl = options.$previewEl;
      var $progressBar = options.$progressBar;
      
      var $form = $($fileInput.parents('form'));
      var $submitButton = $form.find("button");

      var formData = signedPost.fields;

      $fileInput.fileupload({
        fileInput: $fileInput,
        url: signedPost.url.scheme + "://" + signedPost.url.host,
        type: 'POST',
        autoUpload: options.autoUpload || true, // not working?
        formData: formData,
        paramName: 'file',
        dataType: 'XML',
        replaceFileInput: false,
        maxNumberOfFiles: 1,
        dropZone: $fileInput,

        add: function (event, data) {
          var validated = true;
          var file = data.files[0];

          if (!fileTypes.test(file.name)) {
            WavPool.alerter.flashNow({
              context: "danger",
              message: "Invalid audio file type."
            });

            validated = false;
          } else if (file.size > 0xA00000) {
            WavPool.alerter.flashNow({
              context: "danger",
              message: "File too large."
            });

            validated = false;
          }

          if (validated) {
            // Update the MIME type accordingly
            formData["Content-Type"] = file.type;

            data.formData = formData;
            data.submit();
          }
        },

        start: function (event) {
          $fileInput.addClass("hidden");

          $submitButton.prop('disabled', true);
        },

        progressall: function (event, data) {
          if ($progressBar) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            var progressFormat = progress + '%';

            $progressBar.css('width', progressFormat);
            $progressBar.text(progressFormat);
          }
        },

        done: function (event, data) {
          $submitButton.prop('disabled', false);

          if ($progressBar) {
            $progressBar.addClass("progress-bar-success")
          }
          
          var key = $(data.jqXHR.responseXML).find("Key").text();
          var url = '//' + signedPost.url.host + '/' + key;
          
          if ($previewEl) {
            $previewEl.attr("src", url);
          }       
          
          var $input = $("<input>", {
            type: 'hidden',
            name: $fileInput.attr('name'),
            value: key
          });
          
          $form.append($input);
        },
      
      fail: function (event, data) {    
        if ($progressBar) {
            $progressBar.addClass("progress-bar-danger")
          }

        $submitButton.prop('disabled', true);
      }
      });
    });
  }
};

$(document).ajaxError(function (event, xhr) {
  if (xhr.status === 404) {
    WavPool.pageNotFound();
  }
});