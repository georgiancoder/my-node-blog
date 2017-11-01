var mail = require('../../models/cms/mail');
var nodemailer = require('nodemailer');

var mailController = {
  getMessages: function(req, res){
    mail.getMessages(function(err, data){
      res.render('cms/inbox',{title: 'Admin dashboard', user: req.user, mails: data});
    });
  },
  addNew: function(req, res){
    req.checkBody('name','name is required').notEmpty();
    req.checkBody('email','email is not valid').notEmpty().isEmail();
    req.checkBody('msg','message is required').notEmpty();

    req.getValidationResult().then(function(result){
      if(!result.isEmpty()){
        res.json(result.array());
      }
      else {
        mail.newMsg(req.body, function(err, data){
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
              user: 'beqacalani@gmail.com',
              pass: 'jgdmlwzc123'
            }
          });

          var mailOptions = {
            from: req.email,
            to: 'geocoder@mail.ru',
            subject: req.name,
            text: req.msg
          };

          transporter.sendMail(mailOptions,function(error, info){
            if(error){
              console.log(error);
            } else {
              console.log(info.response);
            }
          });
          res.redirect('/contact');
        });
      }
    });
  }
};

module.exports = mailController;
