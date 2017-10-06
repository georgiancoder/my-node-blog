var gallery = require('../../models/cms/gallery');

var galleryController = {
  addGallery: function(data, callback){
    gallery.addNew(data,callback);
  },

  getGallery: function(callback){
    gallery.getAll(callback);
  },

  deleteGallery: function(id, callback){
    if(id){
      gallery.delete(id, callback);
    }
  }
};

module.exports = galleryController;
