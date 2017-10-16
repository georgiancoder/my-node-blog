var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var cmsRoutes = require('./app/routes/cms');
var blogRouter = require('./app/routes/blog');
var expressValidator = require('express-validator');
var https = require('https');
var http = require('http');
var fs = require('fs');
var config = require('./app/config');

try{
var httpsOptions = {
  key: fs.readFileSync('../../../../../../etc/letsencrypt/live/cattaclub.com/privkey.pem'),
  cert: fs.readFileSync('../../../../../../etc/letsencrypt/live/cattaclub.com/fullchain.pem')
};
}catch(err){

}


mongoose.connect(config.mongodb);

app.set('views','views');
app.set('view engine','pug');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({secret: 'secretcode'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){
  if(!req.session.lang){
    req.session.lang = 'ka';
  }
  next();
});


app.use('/cms',cmsRoutes);
app.use('/',blogRouter);


http.createServer(app).listen(3001);
try{
  https.createServer(httpsOptions, app).listen(4433);
}catch(err){
  console.log(err);
}
