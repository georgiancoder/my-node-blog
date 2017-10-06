var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  name: String,
  username: { unique: true, type: String},
  password: String
});

module.exports = mongoose.model('user',userSchema);

module.exports.checkUser = function(username, callback){
    var user = this;
    user.findOne({username: username}, callback);
};

module.exports.comparePass = function(pass1, pass2){
  return bcrypt.compareSync(pass1, pass2);
}
