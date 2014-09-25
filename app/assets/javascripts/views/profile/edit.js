WavPool.Views.ProfileEdit = Backbone.View.extend({
	template: JST["profile/edit"],
  
  initialize: function () {
    this.listenTo(this.model, 'sync', this.render);
  },
  
  events: {
    "submit form": "onSubmit"
  },
  
  onSubmit: function (event) {
    event.preventDefault();
    
    var params = $(event.currentTarget).serializeJSON().profile;
    
    this.model.save(params, {
      success: function (model) {
        $('#profile-display-name').text(model.escape('display_name'));
        
        WavPool.alert({
          context: "success",
          message: "You have successfully updated your profile."
        });
      },
      
      error: function (profile, response) {        
        WavPool.alert({
          context: "danger",
          message: response.responseJSON
        });
      }
    });
  },
  
  bindUploadFields: function () {    
    $.ajax({
      url: "/signed_urls",
      success: function (signedPost) {
        this.$('.directUpload input[type=file]').each(function (i, el) {
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
                value: url
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

  render: function () {
    var renderedContent = this.template({
      profile: this.model
    });

    this.$el.html(renderedContent);
    
    this.bindUploadFields();

    return this;
  }
});