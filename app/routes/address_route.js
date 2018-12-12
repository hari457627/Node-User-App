var express  = require('express'),
    router   = express.Router(),
    User     = require('./../models/user'),
    Address  = require('./../models/address');
// var AuthentService = require('../../idn/AuthValidation');

router.route('/')
    .post(function(request, response) {
        console.log(request.body);
        Address.create(request.body).then(function (address) {
            response.json(address);
        }).catch(function (error) {
            response.json(error);
        })
    })
    
    .get(function (request, response) {
      Address.find().exec().then(function (address) {
          response.json(address);
      }).catch(function (error) {
          response.status(500).json({error: error});
      });
    })

router.route('/all')
    .get(function (request, response) {
      Address.find({userId:request.query.userid}).exec().then(function (address) {
          response.json(address);
      }).catch(function (error) {
          response.status(500).json({error: error});
      });
    });

router.route('/:id')
    .get(function (request, response) {
        console.log(request.params.id);
        Address.findOne({_id:request.params.id}).exec().then(function (address) {
            response.json(address);
        }).catch(function (error) {
            response.status(500).json({error: error});
        });
    })

    .put(function(request, response) {
        console.log(request.params.id);
        Address.findOneAndUpdate({_id:request.params.id},request.body,{new:true}).then(function (address) {
            response.json(address);
        }).catch(function (error) {
            response.json(error);
        })
    })

    .put(function(req, res) {
      Address.remove({_id:req.params.id}).exec().then(function(doc) {
        const response = {
          message: "Address successfully deleted",
          id: todo._id
        };
      return res.status(200).send(response);
      }).catch(function(error) {
        throw error;
      });
    });

module.exports = router;