var blogCat = require('../../models/cms/categories');
var orderCat = require('../../models/cms/categorieorder');
var blogpost = require('../../models/cms/blogpost');

var blogController = {
  getAllCategories: function(callback){
    blogCat.getAll(function(err, data){
      if(err) throw err;
      callback(data);
    });
  },
  addNewCategorie: function(data, callback){
    data.hide = (data.hide) ? true : false;
    if(data.catnameka)
      {
        var names = new Object();
        names.en = data.catnameen;
        names.ka = data.catnameka;
        names.ru = data.catnameru;

        data.catname = names;
        blogCat.addNew(data,function(err, cat){
          if(err) throw err;
          callback(cat);
        });
      }
  },

  addOrUpdateCatItems: function(data, callback){
    orderCat.addOrUpdate(data, function(err, data){
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
          html+='<li data-id="'+sorted[j].itemId+'"><div><a href="/cms/blogcat/update/'+item._id+'">'+item.name.ka+ '</a>' + customText + '</div>';
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
            html += '<li data-id="'+item._id+'"><div>' + item.name.ka + customText + '</div>';
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

  addBlogPost: function(data, callback){
    blogpost.addNewPost(data, callback);
  },

  updateBlogPost: function(data, callback){
    blogpost.update(data, callback);
  },

  getPost: function(callback){
    blogpost.get(function(err, data){
      if(err) throw err;

      callback(data);
    });
  },

  getAllPost: function(callback){
    blogpost.get(callback);
  },

  deletePost: function(id, callback){
    if(id){
      blogpost.deletePost(id,callback);
    }

  },

  removeCategorie: function(id, callback){
    if(id){
      blogCat.deleteCat(id,callback);
    }
  },

  getPostById: function(id, callback){
    if(id)
    blogpost.getById(id,callback);
  }

}

module.exports = blogController;
