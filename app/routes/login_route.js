var express  = require('express'),
    router   = express.Router(),
    User     = require('./../models/user'),
    bcrypt   = require('bcrypt');
const saltRounds = 10;
var Jwt = require('jsonwebtoken');
var config = require('config');
var async = require('async');
var _ = require('lodash');
var cors = require('cors');

// var AuthentService = require('../../idn/AuthValidation');

function generateToken(user_id, cb) {
  Jwt.sign({
      userId: user_id,
  }, "JWTs3CR3T", {
      algorithm: 'HS512',
      expiresIn: Date.now() + 3600000 //1hour
  }, function (err, token) {
      cb(err, token);
  });
}

router.route('/login')
.post(function (request, response) {
  if(request.body.username){
    request.body.username = request.body.username;
    request.body.email = null;
    request.body.mobile = null;
  }
  else if(request.body.email){
    request.body.username = null;
    request.body.email = request.body.email;
    request.body.mobile = null;
  }
  else{
    request.body.username = null;
    request.body.email = null;
    request.body.mobile = request.body.mobile;
  }
  User.findOne({$or:[{'username': request.body.username},{'email':request.body.email},{'mobile':request.body.email}]}).exec().then(function (user) {
     if(user == null){
      response.status(400).json({message: "invalid user"});
     }
     else{
       console.log(user);
        bcrypt.compare(request.body.password, user.password, function(err, resp) {
          if(resp == true){
            console.log(resp);
            const token = Jwt.sign({
                data: user._id
            }, config.get("database.secret"), {
                algorithm: 'HS512',
                expiresIn: 1440000
            }); 
            response.status(200).json({message: "Login successfull",token:token,user:user});
          }
          else{
            response.status(400).json({message: "invalid user"});
          }
        });
     }
  }).catch(function (error) {
      response.status(500).json({error: error});
  });
})
module.exports = router;