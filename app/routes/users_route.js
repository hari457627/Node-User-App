var express  = require('express'),
    router   = express.Router(),
    User     = require('./../models/user'),
    Address     = require('./../models/address'),
    bcrypt   = require('bcrypt');
const saltRounds = 10;
// var AuthentService = require('../../idn/AuthValidation');

router.route('/')
    .get(function (request, response) {
      User.find().exec().then(function (user) {
          response.json(user);
      }).catch(function (error) {
          response.status(500).json({error: error});
      });
    })

router.route('/signup')
    .post(function(request, response) {
        bcrypt.hash(request.body.password,saltRounds, function(err,hash){
          request.body.password = hash;
          User.create(request.body).then(function (user) {
            response.json(user);
          }).catch(function (error) {
              response.json(error);
          })
        })
    })

router.route('/:id')
    .get(function (request, response) {
        console.log(request.params.id);
        User.findOne({_id:request.params.id}).exec().then(function (user) {
            response.json(user);
        }).catch(function (error) {
            response.status(500).json({error: error});
        });
    })

    .put(function(request, response) {
        bcrypt.hash(request.body.password,saltRounds, function(err,hash){
          User.findOneAndUpdate({_id:request.params.id},request.body,{new:true}).then(function (user) {
            response.json(user);
          }).catch(function (error) {
              response.json(error);
          })
        })  
    })

    .delete(function(req, res) {
      User.findByIdAndRemove(req.params.id, (err, todo) => {
      // As always, handle any potential errors:
      if (err) return res.status(500).send(err);
      Address.remove({userId:req.params.id}).exec().then(function(doc) {
        const response = {
          message: "user successfully deleted",
          id: todo._id
        };
      return res.status(200).send(response);
      }).catch(function(error) {
        throw error;
      });
      // We'll create a simple object to send back with a message and the id of the document that was removed
      // You can really do this however you want, though.
    });
  });

module.exports = router;