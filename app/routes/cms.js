var express = require('express');
var cmsRouter = express.Router();
var userController = require('../controllers/cms/userController');
var menuController = require('../controllers/cms/menuController');
var blogController = require('../controllers/cms/blogController');
var galleryController = require('../controllers/cms/galleryController');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var gm = require('gm');

cmsRouter.get('/',function(req, res){
  res.render('cms/login');
});

cmsRouter.get('/dashboard',userController.checkAuth, function(req,res){
  res.render('cms/dashboard',{title: 'Admin dashboard', user: req.user});
});

cmsRouter.get('/menu',userController.checkAuth,function(req, res){
  menuController.get(function(menu){
    menuController.getMenuItems(function(data){
      menuController.getMenuItemsOrder(function(orderdata){
        var menus = [];
        var isSorted = false;
        for(k in menu){
          for(l in orderdata){
            if(menu[k]._id == orderdata[l].menuId){
              menus.push(menuController.generateMenu(data, orderdata, orderdata[l].menuId, {class: 'sortable', customText: '<span onclick="deleteMenuItem(this);" class="removeMenuItem2" >X</span>'}));
              isSorted = true;
              break;
            }
          }
          if(!isSorted){
            menus.push('');
          }
          isSorted = false;
        }
        res.render('cms/menu',{title: 'Admin dashboard - Menus', user: req.user, menu: menu, menuitems: data, orderItems: orderdata, menusArr: menus});
      });
    });
  });
});

cmsRouter.get('/menu/add', userController.checkAuth, function(req, res){
  res.render('cms/addMenu',{title: 'Admin dashboard - Add Menu', user: req.user});
});

cmsRouter.delete('/menu/delete',userController.checkAuth, function(req, res){
  if(req.body.id){
    menuController.delete(req.body.id,function(){
      res.json({msg: 'success'});
    });
  }
});

cmsRouter.put('/menu/updateitem',userController.checkAuth, function(req, res){
  if(req.body.id){
    menuController.updateMenuItem(req.body,function(data){
      res.json({msg: 'success'});
    });
  }
});


cmsRouter.put('/menu/update',userController.checkAuth, function(req, res){
  req.checkBody('id','id missing').notEmpty();
  req.checkBody('name','menu required').notEmpty();
  req.getValidationResult()
  .then(function(result){
    if(!result.isEmpty()){
      res.json(result.array());
    }
    else {
      menuController.update(req.body,function(menu){
        res.json({msg: 'success'});
      });
    }
  });
});

cmsRouter.get('/menu/items',userController.checkAuth, function(req, res){
  menuController.getMenuItemsList(function(menu){
    res.render('cms/menuitems',{title: 'Admin dashboard - Add Menu', user: req.user, items: menu});
  });
});

cmsRouter.post('/menu/add', userController.checkAuth, function(req, res){
  req.checkBody('name','name is required').notEmpty();
  req.getValidationResult()
  .then(function(result){
    if(!result.isEmpty()){
      res.json(result.array());
    }
    else {
      menuController.add(req.body, function(menu){
        res.redirect('/cms/menu');
      });
    }
  });
});

cmsRouter.post('/menu/additem', userController.checkAuth, function(req, res){
  if(req.body.nameka.length > 0 && req.body.nameka != ''){
    menuController.addItem(req.body, function(menu){
      menuController.addOrUpdateMenuItems(menu, function(menu){
        res.json({msg: 'success'});
      });
    });
  } else {
    res.json({msg: 'please enter name'});
  }
});

cmsRouter.delete('/menu/deleteitem',userController.checkAuth,function(req, res){
  if(req.body.id){
    menuController.removeMenuItem(req.body.id,function(){
      res.json({msg: 'success'});
    });
  }
});

cmsRouter.put('/menu/sortitems',userController.checkAuth,function(req, res){
  if(req.body.menuId.length > 0 && req.body.items.length > 0){
    menuController.updateItemOrder(req.body,function(items){
      res.json(items);
    });
  }
});

cmsRouter.get('/logout',function(req, res){
  req.logout();

  res.redirect('/cms');
})


cmsRouter.get('/pages',userController.checkAuth, function(req, res){
  res.render('cms/pages',{title: 'Admin dashboard', user: req.user});
});

cmsRouter.get('/blogcat',userController.checkAuth, function(req, res){
  blogController.getAllCategories(function(data){
    blogController.getCatOrder(function(catorder){
      var menu = blogController.generateMenu(data, catorder,{class: 'sortable', customText: '<span class="removeMenuItem2" onclick="removeCategorie(this);" >X</span>'});
      res.render('cms/blogcat',{title: 'Admin dashboard', user: req.user, categories: data, menu: menu});
    });
  });
});

cmsRouter.get('/blogcat/addnewcat', userController.checkAuth, function(req, res){
  res.render('cms/addblogcat',{title: 'Admin dashboard', user: req.user});
});

cmsRouter.post('/blogcat/addnewcat', userController.checkAuth, function(req, res){
  if(req.body.catnameka.length > 0 && req.body.catnameka.trim() != ""){
    blogController.addNewCategorie(req.body, function(data){
      blogController.addOrUpdateCatItems(data,function(menu){
        res.redirect('/cms/blogcat');
      });
    });
  }
  else{
    res.json({msg: 'please enter name'})
  }

});

cmsRouter.get('/blogcat/posts', userController.checkAuth, function(req, res){
  blogController.getPost(function(data){
    res.render('cms/blogposts',{title: 'Admin dashboard',user: req.user, posts: data});
  });
});

cmsRouter.get('/blogcat/addnewpost', userController.checkAuth, function(req, res){
  blogController.getAllCategories(function(data){
    galleryController.getGallery(function(err, gallery){
      if(err) throw err;
      res.render('cms/addnewpost',{title: 'Admin dashboard', user: req.user, categories: data, galleries: gallery});
    });
  });
});



cmsRouter.post('/blogcat/addnewpost', userController.checkAuth, function(req, res){

	var storage = multer.diskStorage({
		destination: function(req, file, callback) {
			callback(null, './public/uploads');
		},
		filename: function(req, file, callback) {
			callback(null, file.fieldname + '-' + Date.now() + file.originalname);
		}
	});

  var upload = multer({
  		storage: storage,
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: function(req, file, cb){

        if (path.extname(file.originalname) !== ".png" && path.extname(file.originalname) !== ".jpg") {
          return cb(new Error('only png or jpg'));
        }

        cb(null, true);
      }
  	}).single('mainpic');
  	upload(req, res, function(err) {
  		if(err)
      {
        res.json(err);
      }
      else{
        if(req.file)
        req.body.mainpic = '/uploads/' + req.file.filename;
        req.checkBody('titleka','title is required').notEmpty();
        req.checkBody('descka','Description is required');
        req.checkBody('contentka','Content is required');
          req.getValidationResult()
          .then(function(result){
            if(!result.isEmpty()){
              res.json(result.array());
            }
            else {
              blogController.addBlogPost(req.body,function(err, data){
                if(err) throw err;
                res.redirect('/cms/blogcat/posts')
              });
            }
          });
      }
  	});

});

cmsRouter.get('/gallery',userController.checkAuth, function(req, res){
  galleryController.getGallery(function(err, data){
    res.render('cms/gallery',{title: 'Admin dashboard', user: req.user, gallery: data});
  });
});

cmsRouter.get('/gallery/addnew', userController.checkAuth, function(req, res){
	res.render('cms/galleryadd',{title: 'Admin dashboard', user: req.user});
});

cmsRouter.post('/gallery/addnew', userController.checkAuth, function(req, res){
  var date = new Date();
  var newDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay() + '-' + date.getHours() + '-' + date.getMinutes();
	fs.mkdir('public/uploads/gallery/' + newDate,function(err){
	   if (err) {
	      return console.error(err);
	   }


     var storage = multer.diskStorage({
     		destination: function(req, file, callback) {
     			callback(null, './public/uploads/gallery/' + newDate);
     		},
     		filename: function(req, file, callback) {
     			callback(null, file.fieldname + '-' + Date.now() + file.originalname);
     		}
     	});

      var upload = multer({
      		storage: storage,
          limits: { fileSize: 5 * 1024 * 1024 },
          fileFilter: function(req, file, cb){

            if (path.extname(file.originalname) !== ".png" && path.extname(file.originalname) !== ".jpg") {
              return cb(new Error('only png or jpg'));
            }

            cb(null, true);
          }
      	}).array('galleryImages', 12);

        upload(req, res, function(err) {
      		if(err)
          {
            res.json(err);
          }
          else{
            if(req.files){
              var images = [];
              for(i=0; i<req.files.length; i++)
              {
                var newImage = new Object();
                newImage.title = 'default title';
                newImage.desc = 'default image description';
                newImage.url = 'uploads/gallery/' + newDate + '/' + req.files[i].filename;
                var filen = req.files[i].filename;
                gm('public/uploads/gallery/' + newDate + '/' + req.files[i].filename)
                  .resize(150)
                  .crop(150,150,0,0)
                  .write('public/uploads/gallery/' + newDate + '/thumb150x150' + filen, function (err) {
                    if (!err) console.log('done');
                  });
                newImage.thumb = 'uploads/gallery/' + newDate + '/thumb150x150' + filen;
                images.push(newImage);
              }
              req.body.images = images;
              req.body.dir = 'uploads/gallery/' + newDate;
            req.checkBody('title','title is required').notEmpty();
              req.getValidationResult()
              .then(function(result){
                if(!result.isEmpty()){
                  res.json(result.array());
                }
                else {
                  galleryController.addGallery(req.body,function(err, data){
                    if(err) throw err;
                    res.redirect('/cms/gallery');
                  });
                }
              });
            }
          }
      	});

	});
});

cmsRouter.delete('/blog/deletepost',userController.checkAuth, function(req, res){
  blogController.deletePost(req.body.id,function(err, p){
    if(err) res.json(err);
    if(p.mainpic && fs.existsSync('public/' + p.mainpic)){
      fs.unlink('public/' + p.mainpic, function(err){
        if(err) res.json(err);
        else
        res.json({msg: 'success'});
      });
    }
    else{
      res.json({msg: 'success'});
    }
  });
});

cmsRouter.delete('/gallery/deletegallery',userController.checkAuth, function(req, res){
  galleryController.deleteGallery(req.body.id,function(err, g){
    if(err){ res.json(err); }
    else {
    var imerr = 0;
    for(i in g.images){
      fs.unlink('public/' + g.images[i].url, function(err){
        if(err) imerr++;
      });
      fs.unlink('public/' + g.images[i].thumb, function(err){
        if(err) imerr++;
      });
    }
    if(imerr == 0)
    fs.rmdir('public/' + g.dir, function(err){
      res.json({msg: 'success'});
    });
    }
  });

});

cmsRouter.delete('/blog/deletecat',userController.checkAuth, function(req, res){
  blogController.removeCategorie(req.body.id,function(err, cat){
    if(err) {
      res.json(err);
    }
    else {
      res.json({msg: 'success'});
    }
  });
});


cmsRouter.get('/blog/editpost/:id',userController.checkAuth, function(req, res){
  var id = req.params.id;
  blogController.getAllCategories(function(data){
    galleryController.getGallery(function(err, gallery){
      if(err) throw err;
      blogController.getPostById(id,function(err, post){
        if(err) throw err;
        res.render('cms/addnewpost',{title: 'Admin dashboard', user: req.user, categories: data, galleries: gallery, post: post});
      });
    });
  });
});

cmsRouter.delete('/post/deletemainpic',userController.checkAuth, function(req, res){
  var pic = req.body.pic;
  if(pic)
    if(fs.existsSync('public/' + pic)){
      fs.unlink('public/' + pic, function(err){
        if(err) throw err;
        res.json({msg: 'success'});
      });
    }
    else {
      res.json({msg: 'success'});
    }
});

cmsRouter.post('/blogcat/updatepost',userController.checkAuth, function(req, res){
  var storage = multer.diskStorage({
		destination: function(req, file, callback) {
			callback(null, './public/uploads');
		},
		filename: function(req, file, callback) {
			callback(null, file.fieldname + '-' + Date.now() + file.originalname);
		}
	});

  var upload = multer({
  		storage: storage,
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: function(req, file, cb){

        if (path.extname(file.originalname) !== ".png" && path.extname(file.originalname) !== ".jpg") {
          return cb(new Error('only png or jpg'));
        }

        cb(null, true);
      }
  	}).single('mainpic');
  	upload(req, res, function(err) {
  		if(err)
      {
        res.json(err);
      }
      else{
        if(req.file)
        req.body.mainpic = '/uploads/' + req.file.filename;
        req.checkBody('titleka','title is required').notEmpty();
        req.checkBody('descka','Description is required');
        req.checkBody('contentka','Content is required');
          req.getValidationResult()
          .then(function(result){
            if(!result.isEmpty()){
              res.json(result.array());
            }
            else {
              // blogController.addBlogPost(req.body,function(err, data){
              //   if(err) throw err;
              //   res.redirect('/cms/blogcat/posts')
              // });
              blogController.updateBlogPost(req.body,function(err,data){
                if(err) throw err;
                res.redirect('/cms/blogcat/posts');
              });
            }
          });
      }
  	});
});

cmsRouter.post('/login',userController.login);

module.exports = cmsRouter;
