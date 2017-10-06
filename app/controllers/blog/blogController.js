var blogCat = require('../../models/cms/categories');
var orderCat = require('../../models/cms/categorieorder');
var blogpost = require('../../models/cms/blogpost');
var gallery = require('../../models/cms/gallery');

var blogController = {
  getAllCategories: function(callback){
    blogCat.getAll(function(err, data){
      if(err) throw err;
      callback(data);
    });
  },
  getCatOrder: function(callback){
    orderCat.getAll(function(err, data){
      if(err) throw err;
      callback(data);
    });
  },
  generateMenu: function(menuData, orderData, options){
    if(menuData.length > 0){
    var sorted, customText;
    sorted = blogController.sortItems(orderData[0].items);
    if(options){
      customText = options.customText ? options.customText : '';
      var html = (options.class) ? '<ol class="'+options.class+'">' : '<ol>';
    }
    else{
      var html = '<ol>';
    }
    for(j in sorted){
      if(sorted[j].parentId == 0){
        var item = blogController.findInItems(sorted[j].itemId,menuData);
        if(item){
          html+='<li data-id="'+sorted[j].itemId+'"><div>'+item.name+ customText + '</div>';
          html+=blogController.drawChildren(sorted[j].itemId, sorted, menuData, customText);
          html+='</li>';
        }
      }
    }

    html += '</ol>';
    return html;
    }
  },

  findInItems: function(id, items){
    var item;
    for(i in items){
      if(items[i]._id == id){
        item = items[i];
        break;
      }
    }
    return item;
  },

  drawChildren: function(id, items, menuItems, customText){
    var html = "";
    if(blogController.hasChildren(id, items)){
      html+='<ol>';
      for(i in items){
        if(items[i].parentId == id){
          var item = blogController.findInItems(items[i].itemId,menuItems);
          if(item){
            html += '<li data-id="'+item._id+'"><div>' + item.name + customText + '</div>';
            html += blogController.drawChildren(item._id, items, menuItems);
            html += '</li>';
          }
        }
      }
      html += '</ol>';
    }
    return html;
  },

  hasChildren: function(id, items){
    var hasChildren = false;
    for(i in items){
      if(items[i].parentId == id){
        hasChildren = true;
        break;
      }
    }
    return hasChildren;
  },

  sortItems: function(items){
    var newList = [];
    for(i=0; i<items.length; i++){
      newList[items[i].order] = items[i];
    }
    return newList;
  },

  getPost: function(callback){
    blogpost.get(function(err, data){
      if(err) throw err;

      callback(data);
    });
  },

  getPostBySlug: function(slug, lang, callback){
    blogpost.getBySlug(slug, lang, callback);
  },

  replaceWithGallery: function(querystr, callback){
    var galleryids = querystr.match(/\[--!.*!--\]/g);

    for(i in galleryids){
      galleryids[i] = galleryids[i].replace(/\[--!/g,'').replace(/!--\]/,'');
    }


    gallery.getAll(function(err, data){
      if(err) throw err;

      for(i in data){
        for(j in galleryids){

          if(data[i]._id == galleryids[j]){
            var gallerydata = "<ul class='gallery'>";
            for(k = 0; k < data[i].images.length; k++){
              gallerydata += "<li><a href='/"+data[i].images[k].url+"'><img src='/"+data[i].images[k].thumb+"'></a></li>";
            }
            gallerydata += "</ul>";
            querystr = querystr.replace("[--!"+galleryids[j]+"!--]",gallerydata);
          }
        }
      }

      callback(querystr);
    });
  }


};

module.exports = blogController;
