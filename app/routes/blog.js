var express = require('express');
var blogRouter = express.Router();
var blogController = require('../controllers/blog/blogController');

var langs = {
  en: '',
  ka: '',
  ru: ''
};

blogRouter.get('/:lang(ka|en|ru)?',function(req, res){
  if(req.params.lang)
    req.session.lang = req.params.lang;

   langs.en = req.protocol + '://' + req.headers.host + '/en';
   langs.ka = req.protocol + '://' + req.headers.host + '/ka';
   langs.ru = req.protocol + '://' + req.headers.host + '/ru';
  blogController.getPost(function(data){
    res.render('blog/home',{page: 'home', posts: data, lang: req.session.lang, langs: langs});
  });
});



blogRouter.get('/:lang(ka|en|ru)?/contact',function(req, res){
  if(req.params.lang)
   req.session.lang = req.params.lang;

   langs.en = req.protocol + '://' + req.headers.host + '/en/contact';
   langs.ka = req.protocol + '://' + req.headers.host + '/ka/contact';
   langs.ru = req.protocol + '://' + req.headers.host + '/ru/contact';
  blogController.getAllCategories(function(categories){
    blogController.getCatOrder(function(catorder){
      var cat = blogController.generateMenu(categories, catorder);
      res.render('blog/contact',{categories: cat, page: 'contact', lang: req.session.lang, langs: langs});
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
          langs.en = req.protocol + '://' + req.headers.host + '/en/post/' + data.slug.en;
          langs.ka = req.protocol + '://' + req.headers.host + '/ka/post/' + data.slug.ka ;
          langs.ru = req.protocol + '://' + req.headers.host + '/ru/post/' + data.slug.ru;

          blogController.replaceWithGallery(data.content[req.session.lang], function(contentdata){
            data.textCont = contentdata;
            res.render('blog/singlepost',{blogdata: data, lang: req.session.lang, langs: langs});
          });
        }
    });
  }
});


module.exports = blogRouter;
