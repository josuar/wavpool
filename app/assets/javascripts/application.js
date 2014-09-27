// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery.serializejson
//= require jquery.ui.widget
//= require jquery.fileupload
//= require bootstrap
//= require underscore
//= require backbone
//= require_tree ./plugins
//= require wavpool
//= require_tree ../templates
//= require_tree ./utils
//= require_tree ./models
//= require_tree ./collections
//= require_tree ./views
//= require_tree ./routers
//= require_tree .

Backbone.Collection.prototype.getOrFetch = function (id, cb) {
  var model = this.get(id);
  
  if (model) {
    model.fetch();
  } else {
    model = new this.model({ id: id });
    
    model.fetch({
      success: function () {
        this.add(model);
        
        if (cb) {
          cb(model);
        }
        
      }.bind(this)
    });
  }
  
  return model;
};