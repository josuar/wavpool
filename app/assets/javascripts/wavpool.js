window.WavPool = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  initialize: function (options) {
    if (options.profileId !== 0) {
      this.profile = WavPool.profiles.getOrFetch(options.profileId);
    } else {
      this.profile = null;
    }

    this.s3Bucket = options.s3Bucket;

    this.alertView = new WavPool.Views.Alert();

    this.beginRouting({
      $rootEl: $('main')
    });
  },
  
  alert: function (alert) {
    this.alertView.clear();
    this.alertView.set(alert);
  },

  beginRouting: function (options) {
    var router = new WavPool.Routers.Router(options);
    
    router.on('route', function () {
      this.alertView.clear();
    }.bind(this));

    Backbone.history.start();
  },
  
  s3Url: function (url) {
    return this.s3Bucket + url;
  },

  getUploadPost: function (callback) {
    $.ajax({
      url: "/signed_urls",
      success: callback
    });
  },
  
  pageNotFound: function () {
    Backbone.history.navigate('#', {
      trigger: true,
      replace: true
    });
    
    this.alert({
      context: "warning",
      message: "That page doesn't exist!"
    });
  },

  bindUploadField: function (options) {
    this.getUploadPost(function (signedPost) {
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

        add: function (event, data) {
          var validated = true;
          var file = data.files[0];

          if (!fileTypes.test(file.name)) {
            WavPool.alert({
              context: "danger",
              message: "Invalid audio file type."
            });

            validated = false;
          } else if (file.size > 0xA00000) {
            WavPool.alert({
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

            WavPool.alertView.clear();
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

$(document).ajaxError(function (event, xhr, settings, exception) {
  if (xhr.status === 404) {
    WavPool.pageNotFound(); 
  }
});