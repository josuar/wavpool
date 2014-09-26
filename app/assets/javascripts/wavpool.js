window.WavPool = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  initialize: function (options) {
    this.profileId = options.profileId;
    this.s3Bucket = options.s3Bucket;
    
    this.profile = WavPool.profiles.getOrFetch(this.profileId);
    
    this.alertView = new WavPool.Views.Alert();

    this.startRouter({
      $rootEl: $('main')
    });

    Backbone.history.start();
  },
  
  alert: function (alert) {
    this.alertView.clear();
    this.alertView.set(alert);
  },

  startRouter: function (options) {
    var router = new WavPool.Routers.Router(options);
    
    router.on('route', function () {
      this.alertView.clear();
    }.bind(this));
  },
  
  s3Url: function (url) {
    return this.s3Bucket + url;
  },
  
  bindUploadFields: function () {    
    $.ajax({
      url: "/signed_urls",
      success: function (signedPost) {
        $('.directUpload input[type=file]').each(function (i, el) {
          var fileInput = $(el);
          var form = $(fileInput.parents('form'));
          var submit = form.find('input[type=submit]');
          var img = form.find('img');
      
          // var progressBar = $("<div>").addClass("bar");
          // var barContainer = $("<div>").addClass("progress").append(progressBar);
      
          // fileInput.after(barContainer);
          
          var formData = signedPost.fields;
      
          fileInput.fileupload({
            fileInput: fileInput,
            url: signedPost.url.scheme + "://" + signedPost.url.host,
            type: 'POST',
            autoUpload: true,
            formData: formData,
            paramName: 'file',
            dataType: 'XML',
            replaceFileInput: false,
            
            add: function (event, data) {
              formData["Content-Type"] = data.files[0].type;
              data.formData = formData;
              data.submit();
            },
            
            progressall: function (event, data) {
            },
            
            start: function (event) {
              submit.prop('disabled', true);
            },
            
            done: function (event, data) {
              submit.prop('disabled', false);
              
              var key = $(data.jqXHR.responseXML).find("Key").text();
              var url = '//' + signedPost.url.host + '/' + key;
              
              img.attr("src", url);
              
              var input = $("<input>", {
                type: 'hidden',
                name: fileInput.attr('name'),
                value: key
              });
              
              form.append(input);
            },
            
            fail: function (event, data) {            
              submit.prop('disabled', true);
            }
          });
        });
      }.bind(this)
    });
  },
};