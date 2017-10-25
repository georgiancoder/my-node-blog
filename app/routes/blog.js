var express = require('express');
var blogRouter = express.Router();
var blogController = require('../controllers/blog/blogController');
var config = require('../config');
var fs = require('fs');


var siteLangs = JSON.parse(fs.readFileSync(__dirname + '/../langs.json','utf-8'));
var langs = {
  en: '',
  ka: '',
  ru: ''
};


blogRouter.get('/:lang(ka|en|ru)?',function(req, res){
  if(req.params.lang)
    req.session.lang = req.params.lang;

   langs.en = config.url + '/en';
   langs.ka = config.url + '/ka';
   langs.ru = config.url + '/ru';
  blogController.getPost(function(data){
    res.render('blog/home',{page: 'home', posts: data, lang: req.session.lang, langs: langs, fb: { url: config.url + req.originalUrl, originUrl: config.url }});
  });
});



blogRouter.get('/:lang(ka|en|ru)?/contact',function(req, res){
  if(req.params.lang)
   req.session.lang = req.params.lang;

   langs.en = config.url + '/en/contact';
   langs.ka = config.url + '/ka/contact';
   langs.ru = config.url + '/ru/contact';
  blogController.getAllCategories(function(categories){
    blogController.getCatOrder(function(catorder){
      var cat = blogController.generateMenu(categories, catorder);
      res.render('blog/contact',{sitelang: siteLangs.contact, categories: cat, page: 'contact', lang: req.session.lang, langs: langs, fb: { url: config.url + req.originalUrl, originUrl: config.url }});
    });
  });

});

blogRouter.get('/:lang(ka|en|ru)?/post/:slug',function(req, res){
  if(req.params.lang)
   req.session.lang = req.params.lang;

  if(req.params.slug){
    blogController.getPostBySlug(req.params.slug,req.session.lang,function(err, data){
        if(data == null){
          res.send('post is not exists');
        }
        else{
          langs.en = config.url + '/en/post/' + data.slug.en;
          langs.ka = config.url + '/ka/post/' + data.slug.ka;
          langs.ru = config.url + '/ru/post/' + data.slug.ru;

          blogController.replaceWithGallery(data.content[req.session.lang], req.session.lang, function(contentdata){
            data.textCont = contentdata;
            res.render('blog/singlepost',{blogdata: data, lang: req.session.lang, langs: langs, fb: { url: config.url + req.originalUrl, originUrl: config.url }});
          });
        }
    });
  }
});


module.exports = blogRouter;
