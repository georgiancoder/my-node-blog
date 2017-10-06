var mongoose = require('mongoose');

var orderCategorieSchema = mongoose.Schema({
  items: [{
    itemId: String,
    order: String,
    parentId: String
  }]
});

module.exports = mongoose.model('categorieOrder',orderCategorieSchema);

module.exports.getAll = function(callback){
  var menu = this;
  menu.find(callback);
};

module.exports.addOrUpdate = function(itemdata,callback){
  var menu = this;
  menu.find(function(err, orderdata){
    if(err) throw err;
    if(orderdata.length > 0){
      var items = orderdata[0].items;
      // find highest order in items
      var order = 0;
      for(i in items){
        if(items[i].order > order){
          order = items[i].order;
        }
      }
      items.push({ itemId: itemdata._id, order: order+1, parentId: '0'});
      menu.update({},{items: items},callback);
    }
    else {
        var newMenuOrder = new menu();
        newMenuOrder.items.push({ itemId: itemdata._id, order: 0, parentId: '0'});
        newMenuOrder.save(callback);
    }
  })
};


module.exports.updateItems = function(items, callback){
  var menu = this;
  var items = JSON.parse(items);
  menu.items = items;
  menu.save(callback);
};
