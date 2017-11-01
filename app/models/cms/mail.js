var mongoose = require('mongoose');

var mailSchema = mongoose.Schema({
  name: String,
  email: String,
  msg: String
});

module.exports = mongoose.model('mail',mailSchema);

module.exports.newMsg = function(data, callback){
  var mail = this;
  var newMail = new mail();
  newMail.name = data.name;
  newMail.email = data.email;
  newMail.msg = data.msg;

  newMail.save(callback);
};

module.exports.getMessages = function(callback){
  var mail = this;
  mail.find(callback);
};
