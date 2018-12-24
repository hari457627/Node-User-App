var express     = require('express'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    morgan      = require('morgan'),
    // passport    = require('passport'),
    jwt = require('jsonwebtoken'),
    response    = {},
    cors       =  require('cors'),
    app         = express(),
    response    = {},
    config      = require('config'),
    accessToken = require('./idn/AccessToken'),
    authVerify  = require('./idn/AuthValidation'),
    path        = require('path'),
    settings    = require('./config/settings');

// mongoose.connect(config.get("database.url"), { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
// var corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

mongoose.connect(config.get("database.url")).then(
    () => { 
        console.log('connected'); 
    },
    err => { 
        /** handle initial connection error */
        console.log(err);
    }
);

// route middleware to verify a token
var token_route =function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(req.url == '/api/users/signup' || req.url == '/api/user/login' || req.url == '/api/users/fileupload' ){
        var tokenSignup = jwt.sign(req.body, config.get("database.secret"));
        jwt.verify(tokenSignup, config.get("database.secret"), function(err, decoded) {
            if (err) {
              return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
              // if everything is good, save to request for use in other routes
              req.decoded = decoded;
              next();
            }
        });
    }
    // decode token
    else if (token) {
      // verifies secret and checks exp
      jwt.verify(token, config.get("database.secret"), function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // if there is no token
      // return an error
      return res.status(401).send({ error: 'No token provided.' });
    }
  };

// accessToken.getAccessToken().then(function(response){
// }, function(response){
// });

var User_Route=require('./app/routes/users_route');
var Address_Route=require('./app/routes/address_route');
var Login_Route=require('./app/routes/login_route');
var make_response_as_global = function(req, res, next){
    response = res;
    next();
};

app.use(morgan('combined'));                        
app.use(make_response_as_global);
app.use(token_route);
app.use(cors())

// Setting up request headers to support Angular applications
// app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session());


// app.use(function timeLog (req, res, next) {
//     console.log('Time: ', Date.now());
//     if (req.headers.authorization) {
//         var userToken = req.headers.authorization.split("Bearer ")[1];
//         authVerify.validateToken(userToken).then(function(response) {
//             next();
//         }, function(error) {
//             res.json({ "error": error});
//         });
//     } else {
//         res.json({ "error": "no auth header" });
//     }
// });

// app.use(settings.headers); 

// Setting up resquest headers to support Angular applications
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
    next();
});

app.use('/api/users/', User_Route);//including routes to application
app.use('/api/users/address', Address_Route);//including routes to application
app.use('/api/user/', Login_Route);


/* Exception Handling for uncaught Exceptions*/
process.on('uncaughtException', function(err){
    console.log('\n Caught exception:'+ err);
    response.status(500).json({error: "500 internal server error"});
});


app.listen(2001,function(){
    console.log("Server is running on port 2001");
});
