var mongoose = require('mongoose');


var categoriesSchema = mongoose.Schema({
  name: {
    en: String,
    ka: String,
    ru: String
  },
  slug: {
    en: { type: String, unique: true },
    ka: { type: String, unique: true },
    ru: { type: String, unique: true }
  },
  color: String,
  catIcon: String,
  hide: Boolean
});


module.exports = mongoose.model('categories',categoriesSchema);

module.exports.getAll = function(callback){
  var cat = this;
  cat.find(callback);
};

module.exports.addNew = function(data, callback){
  var cat = this;
  var newCat = new cat();



  slugsen = data.catnameen.replace(/ /g,'-');
  slugska = data.catnameka.replace(/ /g,'-');
  slugsru = data.catnameru.replace(/ /g,'-');

  cat.find({$or: [{'slug.en': slugsen}, {'slug.ka': slugska}, {'slug.ru': slugsru}]},function(err,slugs){
    if(err) throw err;

    if(slugs && slugs.length > 0){
      slugsen = slugsen + slugs.length;
      slugska = slugska + slugs.length;
      slugsru = slugsru + slugs.length;
    }


    newCat.name = {
      en: data.catname.en,
      ka: data.catname.ka,
      ru: data.catname.ru
    };
    newCat.hide = data.hide;
    newCat.slug = {
      en: slugsen,
      ka: slugska,
      ru: slugsru
    };

    newCat.save(callback);
  });

};

module.exports.deleteCat = function(id, callback){
  var cat = this;

  cat.findByIdAndRemove(id,callback);
};

module.exports.updatecat = function(data, callback){
  var cat = this;

};
