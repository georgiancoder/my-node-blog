var mongoose = require('mongoose');

var gallerySchema = mongoose.Schema({
  title: {
    en: String,
    ka: String,
    ru: String
  },
  desc: {
    en: String,
    ka: String,
    ru: String
  },
  createdate: { type: Date, default: Date.now },
  dir: String,
  images: [
    {
      title: {
        en: String,
        ka: String,
        ru: String
      },
      desc: {
        en: String,
        ka: String,
        ru: String
      },
      url: String,
      thumb: String
    }
  ]
});

module.exports = mongoose.model('gallery',gallerySchema);

module.exports.addNew = function(data, callback){
  var gallery = this;

  var newGallery = new gallery();

  newGallery.title.ka = data.titleka;
  newGallery.desc.ka = data.descka;
  newGallery.dir = data.dir;
  newGallery.images = data.images;

  newGallery.save(callback);
};

module.exports.getById = function(id, callback){
  var gallery = this;

  gallery.findById(id, callback);
};

module.exports.updateImageInGallery = function(data,callback){
  var gallery = this;

  gallery.update({'_id': data.gid, 'images._id': data.imId },{$set: {
    'images.$.title.ka' : data.titleka,
    'images.$.title.en' : data.titleen,
    'images.$.title.ru' : data.titleru,
    'images.$.desc.ka' : data.descka,
    'images.$.desc.en' : data.descen,
    'images.$.desc.ru' : data.descru
  }}, callback);
};

module.exports.getAll = function(callback){
  var gallery = this;

  gallery.find(callback);
};

module.exports.delete = function(id, callback){
  var gallery = this;

  gallery.findByIdAndRemove(id,callback);
};
