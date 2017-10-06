var express = require('express');
var blogRouter = express.Router();
var blogController = require('../controllers/blog/blogController');

var langs = {
  en: '',
  ka: '',
  ru: ''
};

blogRouter.get('/',function(req, res){
  if(req.query.lang)
   req.session.lang = req.query.lang;

   langs.en = req._parsedUrl.pathname + '?lang=en';
   langs.ka = req._parsedUrl.pathname + '?lang=ka';
   langs.ru = req._parsedUrl.pathname + '?lang=ru';
  blogController.getPost(function(data){
    res.render('blog/home',{page: 'home', posts: data, lang: req.session.lang, langs: langs});
  });
});



blogRouter.get('/contact',function(req, res){
  if(req.query.lang)
   req.session.lang = req.query.lang;

   langs.en = req._parsedUrl.pathname + '?lang=en';
   langs.ka = req._parsedUrl.pathname + '?lang=ka';
   langs.ru = req._parsedUrl.pathname + '?lang=ru';
  blogController.getAllCategories(function(categories){
    blogController.getCatOrder(function(catorder){
      var cat = blogController.generateMenu(categories, catorder);
      res.render('blog/contact',{categories: cat, page: 'contact', lang: req.session.lang, langs: langs});
    });
  });

});

blogRouter.get('/post/:slug',function(req, res){
  if(req.query.lang)
   req.session.lang = req.query.lang;

  if(req.params.slug){
    blogController.getPostBySlug(req.params.slug,req.session.lang,function(err, data){
        if(data == null){
          res.send('post is not exists');
        }
        else{
          langs.en = '/post/'  + data.slug.en + '?lang=en';
          langs.ka = '/post/' + data.slug.ka + '?lang=ka';
          langs.ru = '/post/' + data.slug.ru + '?lang=ru';
          blogController.replaceWithGallery(data.content[req.session.lang], function(contentdata){
            data.textCont = contentdata;
            res.render('blog/singlepost',{blogdata: data, lang: req.session.lang, langs: langs});
          });
        }
    });
  }
});


module.exports = blogRouter;
