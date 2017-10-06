var mongoose = require('mongoose');

var orderMenuSchema = mongoose.Schema({
  menuId: String,
  items: [{
    itemId: String,
    order: String,
    parentId: String
  }]
});


module.exports = mongoose.model('menuorder',orderMenuSchema);

module.exports.getAll = function(callback){
  var menu = this;
  menu.find(callback);
};

module.exports.addOrUpdate = function(itemdata,callback){
  var menu = this;
  menu.findOne({menuId: itemdata.menuId}, function(err, orderdata){
    if(err) throw err;
    if(orderdata){
      var items = orderdata.items;
      // find highest order in items
      var order = 0;
      for(i in items){
        if(items[i].order > order){
          order = items[i].order;
        }
      }
      items.push({ itemId: itemdata._id, order: order+1, parentId: '0'});
      menu.update({menuId: itemdata.menuId},{items: items},callback);
    }
    else {
        var newMenuOrder = new menu();
        newMenuOrder.menuId = itemdata.menuId;
        newMenuOrder.items.push({ itemId: itemdata._id, order: 0, parentId: '0'});
        newMenuOrder.save(callback);
    }
  })
};


module.exports.updateItems = function(menuId, items, callback){
  var menu = this;
  var items = JSON.parse(items);
  menu.findOneAndUpdate({menuId: menuId},{items: items},callback);
};
