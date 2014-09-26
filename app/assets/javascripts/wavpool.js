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

  bindUploadField: function (fileTypes, $fileInput, $previewEl) {
    this.getUploadPost(function (signedPost) {
      var $form = $($fileInput.parents('form'));
      var $submitButton = $form.find("input[type=submit]");

      var formData = signedPost.fields;

      $fileInput.fileupload({
        fileInput: $fileInput,
        url: signedPost.url.scheme + "://" + signedPost.url.host,
        type: 'POST',
        autoUpload: true,
        formData: formData,
        paramName: 'file',
        dataType: 'XML',
        replaceFileInput: false,
        maxNumberOfFiles: 1,

        add: function (event, data) {
          var validated = true;
          var file = data.files[0];

          if (!fileTypes.test(file.name)) {
            console.log("bad file name")
            validated = false;
          } else if (file.size > 0xA00000) {
            console.log("bad file size")
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
          $submitButton.prop('disabled', true);
        },

        done: function (event, data) {
          console.log("uploaded");
          $submitButton.prop('disabled', false);
          
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
        $submitButton.prop('disabled', true);
      }
      });
    });
  }
};