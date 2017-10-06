var mongoose = require('mongoose');
var util = require('util');

var blogpostSchema = mongoose.Schema({
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
  content: {
    en: String,
    ka: String,
    ru: String
  },
  mainpic: String,
  slug: {
    en: { type: String, unique: true },
    ka: { type: String, unique: true },
    ru: { type: String, unique: true }
  },
  createdate: { type: Date, default: Date.now },
  author: String,
  views: { type: Number, default: 0 },
  catIds: [],
});


module.exports = mongoose.model("blogpost",blogpostSchema);

module.exports.addNewPost = function(data, callback){
  var post = this;
  var newPost = new post();


  slugsen = data.titleen.replace(/ /g,'-');
  slugska = data.titleka.replace(/ /g,'-');
  slugsru = data.titleru.replace(/ /g,'-');

  post.find({$or: [{'slug.en': slugsen}, {'slug.ka': slugska}, {'slug.ru': slugsru}]},function(err, slugs){
    if(err) throw err;

    if(slugs && slugs.length > 0){
      slugsen = slugsen + slugs.length;
      slugska = slugska + slugs.length;
      slugsru = slugsru + slugs.length;
    }

    newPost.title = {
      en: data.titleen,
      ka: data.titleka,
      ru: data.titleru
    };
    newPost.desc = {
      en: data.descen,
      ka: data.descka,
      ru: data.descru
    };
    newPost.content = {
      en: data.contenten,
      ka: data.contentka,
      ru: data.contentru
    };
    newPost.author = data.author;
    newPost.slug = {
      en: slugsen,
      ka: slugska,
      ru: slugsru
    };
    (data.mainpic) ? newPost.mainpic = data.mainpic : newPost.mainpic = '';
    if(data.catIds && util.isArray(data.catIds)){
      newPost.catIds = data.catIds;
    }
    else if(data.catIds && !util.isArray(data.catIds)){
      newPost.catIds.push(data.catIds);
    }

    newPost.save(callback);
  });


};

module.exports.get = function(callback){
  var post = this;

  post.find(callback);
};

module.exports.getBySlug = function(slug, lang, callback){
  var post = this;
  console.log(slug);
  switch (lang) {
    case 'ka':
      post.findOne({'slug.ka': slug},callback);
      break;
    case 'en':
      post.findOne({'slug.en': slug},callback);
      break;
    case 'ru':
      post.findOne({'slug.ru': slug},callback);
      break;
  }

};

module.exports.getById = function(id, callback){
  var post = this;

  post.findById(id,callback);
};

module.exports.deletePost = function(id, callback){
  var post = this;

  post.findByIdAndRemove(id,callback);
};


module.exports.update = function(data, callback){
  var post = this;
  var catids = [];
  var updateobj = {};
  var postid = data.postid;
  console.log(data);

  slugsen = data.titleen.replace(/ /g,'-');
  slugska = data.titleka.replace(/ /g,'-');
  slugsru = data.titleru.replace(/ /g,'-');

  (data.mainpic) ? updateobj.mainpic = data.mainpic : '';
  if(data.catIds && util.isArray(data.catIds)){
    catids = data.catIds;
  }
  else if(data.catIds && !util.isArray(data.catIds)){
    catids.push(data.catIds);
  }
  post.find({$and: [{_id: { $ne: postid}},{$or: [{'slug.en': slugsen}, {'slug.ka': slugska}, {'slug.ru': slugsru}]}]},function(err, slugs){

    if(err) throw err;

    if(slugs && slugs.length > 0){
      slugsen = slugsen + slugs.length;
      slugska = slugska + slugs.length;
      slugsru = slugsru + slugs.length;
    }

    updateobj.author = data.author;
    updateobj.title = {
      en: data.titleen,
      ka: data.titleka,
      ru: data.titleru
    };
    updateobj.desc = {
      en: data.descen,
      ka: data.descka,
      ru: data.descru
    };
    updateobj.content = {
      en: data.contenten,
      ka: data.contentka,
      ru: data.contentru
    };

    updateobj.slug = {
      en: slugsen,
      ka: slugska,
      ru: slugsru
    };
    updateobj.catIds = catids;

    post.findByIdAndUpdate(data.postid,updateobj, callback);

  });

};
