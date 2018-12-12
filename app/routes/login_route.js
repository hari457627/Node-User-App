var express  = require('express'),
    router   = express.Router(),
    User     = require('./../models/user'),
    bcrypt   = require('bcrypt');
const saltRounds = 10;
// var AuthentService = require('../../idn/AuthValidation');

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
  User.findOne({$or:[{username: request.body.username},{email:request.body.email},{mobile:request.body.email}]}).exec().then(function (user) {
    bcrypt.compare(request.body.password, user.password, function(err, res) {
      if(res === true){
        response.status(200).json({message: "Login successfull"});
      }
      else{
        response.status(200).json({message: "invalid user"});
      }
    });
  }).catch(function (error) {
      response.status(500).json({error: error});
  });
})
module.exports = router;