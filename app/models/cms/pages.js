var mongoose = require('mongoose');

var pagesSchema = mongoose.Schema({
  title: String,
  content: String,
  hide: Boolean
});
