var mongoose = require('mongoose');

var gallerySchema = mongoose.Schema({
  title: String,
  desc: String,
  createdate: { type: Date, default: Date.now },
  dir: String,
  images: [
    {
      title: String,
      desc: String,
      url: String,
      thumb: String
    }
  ]
});

module.exports = mongoose.model('gallery',gallerySchema);

module.exports.addNew = function(data, callback){
  var gallery = this;

  var newGallery = new gallery();

  newGallery.title = data.title;
  newGallery.desc = data.desc;
  newGallery.dir = data.dir;
  newGallery.images = data.images;

  newGallery.save(callback);
};

module.exports.getById = function(id, callback){
  var gallery = this;

  gallery.findById(id, callback);
};

module.exports.getAll = function(callback){
  var gallery = this;

  gallery.find(callback);
};

module.exports.delete = function(id, callback){
  var gallery = this;

  gallery.findByIdAndRemove(id,callback);
};
