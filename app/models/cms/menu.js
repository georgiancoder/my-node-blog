var mongoose = require('mongoose');

var menuSchema = mongoose.Schema({
  name: String,
  hide: Boolean
});

module.exports = mongoose.model('menu',menuSchema);

module.exports.addNew = function(data,callback){
  var menu = this;
  var newMenu = new menu({
    name: data.name,
    hide: data.hide
  });

  newMenu.save(callback);
};


module.exports.remove = function(id,callback){
  var menu = this;
  menu.findByIdAndRemove(id,callback);
};

module.exports.getAll = function(callback){
  var menu = this;
  menu.find(callback);
};


module.exports.update = function(data,callback){
  var menu = this;
  menu.findByIdAndUpdate(data.id,{name: data.name, hide: data.hide},callback);
}
