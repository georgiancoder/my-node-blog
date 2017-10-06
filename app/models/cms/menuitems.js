var mongoose = require('mongoose');

var menuItemsSchema = mongoose.Schema({
  menuId: String,
  name: {
    en: String,
    ru: String,
    ka: String
  },
  url: String,
  hide: Boolean
});

module.exports = mongoose.model('menuItems',menuItemsSchema);

module.exports.add = function(data,callback){
  var menuitems = this;
  var newitem = new menuitems({
    menuId: data.menuId,
    name: data.name,
    url: data.url,
    hide: data.hide
  });

  newitem.save(callback);
};

module.exports.getAll = function(callback){
  var menuitems = this;
  menuitems.find(callback);
};

module.exports.delete = function(id,callback){
  var menuitems = this;
  menuitems.findByIdAndRemove(id,callback);
};

module.exports.update = function(data,callback){
  var menuitems = this;
  menuitems.findByIdAndUpdate(data.id,{name: data.name, url: data.url, hide: data.hide},callback);
}
