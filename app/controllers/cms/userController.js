var User = require('../../models/cms/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.checkUser(username,function(err, user){
      if(err) return done(err);
      if(!user){
        return done(null, false,{message: 'incorrect username'});
      }
      if(!User.comparePass(password, user.password)){
        return done(null, false, {message: 'incorrect password'});
      }

      return done(null,user);
    });
  }
));

var UserController = {
  login: function(req, res, next){

    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/cms'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/cms/dashboard');
      });
    })(req, res, next);
  },
  checkAuth: function(req, res, next){
    if(req.isAuthenticated()){
       //if user is looged in, req.isAuthenticated() will return true
       next();
   } else{
       res.redirect("/cms");
   }
  }
}

module.exports = UserController;
