var Menu = require('../../models/cms/menu');
var MenuItems = require('../../models/cms/menuitems');
var menuOrder = require('../../models/cms/menuitemlisting');

var menuController = {
  add: function(data,callback){
    if(data.hide == undefined){
      data.hide = false;
    }
    else {
      data.hide = true;
    }

    Menu.addNew(data,function(err, menu){
      if(err) throw err;
      callback(menu);
    });

  },
  get: function(callback){
    Menu.getAll(function(err, menu){
      if(err) throw err;
      callback(menu);
    });
  },
  delete: function(id, callback){
    Menu.remove(id,function(err, menu){
      if(err) throw err;
      callback(menu);
    });
  },

  update: function(data, callback){
    Menu.update(data,function(err, menu){
      if(err) throw err;
      callback(menu);
    })
  },

  addItem: function(data, callback){
    if(data.parentId == undefined){
      data.parentId = 0;
    }
    if(data.order == undefined){
      data.order = 0;
    }

    var names = new Object();
    names.en = data.nameen;
    names.ru = data.nameru;
    names.ka = data.nameka;

    data.name = names;
    MenuItems.add(data,function(err, item){
      if(err) throw err;
      callback(item);
    });
  },

  getMenuItems: function(callback){
    MenuItems.getAll(function(err, data){
      if(err) throw err;
      // var nd = menuController.sortItemsByMenuIds(data);

      callback(data);
    });
  },

  generateMenu: function(menuData, orderData, menuId, options){
    if(menuData.length > 0){
    var sorted, customText;
    for(i in orderData){
      if(orderData[i].menuId == menuId){
          sorted = menuController.sortItems(orderData[i].items);
      }
    }
    if(options){
      customText = options.customText ? options.customText : '';
      var html = (options.class) ? '<ol class="'+options.class+'">' : '<ol>';
    }
    else{
      var html = '<ol>';
    }

    for(j in sorted){
      if(sorted[j].parentId == 0){
        var item = menuController.findInItems(sorted[j].itemId,menuData);
        if(item){
          html+='<li data-id="'+sorted[j].itemId+'"><div>'+item.name.ka+ customText + '</div>';
          html+=menuController.drawChildren(sorted[j].itemId, sorted, menuData, customText);
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
    if(menuController.hasChildren(id, items)){
      html+='<ol>';
      for(i in items){
        if(items[i].parentId == id){
          var item = menuController.findInItems(items[i].itemId,menuItems);
          if(item){
            html += '<li data-id="'+item._id+'"><div>' + item.name.ka + customText + '</div>';
            html += menuController.drawChildren(item._id, items, menuItems, customText);
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

  getMenuItemsList: function(callback){
    MenuItems.getAll(function(err, data){
      if(err) throw err;

      callback(data);
    });
  },

  getMenuItemsOrder: function(callback){
    menuOrder.getAll(function(err, data){
      if(err) throw err;
      callback(data);
    })
  },

  addOrUpdateMenuItems: function(data2, callback){
    menuOrder.addOrUpdate(data2, function(err, data){
      if(err) throw err;
      callback(data);
    });
  },

  removeMenuItem: function(id, callback){
    MenuItems.delete(id,function(err, menuitem){
      if(err) throw err;
      callback();
    });
  },

  updateItemOrder: function(data,callback){
    menuOrder.updateItems(data.menuId,data.items,function(err,items){
      if(err) throw err;
      callback(items);
    });
  },

  updateMenuItem: function(data, callback){
    MenuItems.update(data,function(err,data){
      if(err) throw err;
      callback(data);
    });
  }

  // sortItemsByMenuIds: function(data){
  //   var newdata = new Object();
  //   for(i in data){
  //     newdata[data[i].menuId] = {};
  //     newdata[data[i].menuId].children = [];
  //     for(j in data){
  //       if(data[i].menuId == data[j].menuId)
  //       newdata[data[i].menuId].children.push(data[j]);
  //     }
  //   }
  //   return newdata;
  // }
};

module.exports = menuController;
