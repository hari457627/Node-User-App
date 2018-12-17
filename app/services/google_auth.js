var express =   require("express");
var app =   express();
var router = express.Router();
var passport = require('passport');
var config =  require('config');
var GoogleStrategy = require('passport-google-oauth20');

module.exports = {
    googleAuthentication: function(){
      var result = {};
      var options = {
        clientID : config.get('clientID'),
        clientSecret : config.get('clientSecret')
      }

      passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });

      passport.use(new GoogleStrategy({
        callbackURL:'/google/redirect',
        clientID:options.clientID,
        clientSecret:options.clientSecret
      },
      function(token, refreshToken, profile, done)  {
        result.profile=profile;
        result.token=token;
          console.log(prof);
          return done(null, {
              profile: prof,
              token: token
          });
      }));

      passport.authenticate('google', { scope:
        [ 'https://www.googleapis.com/auth/plus.login',
          'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
      )
        return result;
    }
}


// app.get( '/google/redirect',function (err,res) {
		
//         res.sendFile(__dirname + "/google/success.html");
//         if(err){
//         	console.log(err);
//             res.sendFile(__dirname + "/google/fail.html");
//         }
//     }

//     );