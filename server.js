var express     = require('express'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    morgan      = require('morgan'),
    app         = express(),
    response    = {},
    config      = require('config'),
    accessToken = require('./idn/AccessToken'),
    authVerify  = require('./idn/AuthValidation'),
    path        = require('path'),
    settings    = require('./config/settings');

// mongoose.connect(config.get("database.url"), { useMongoClient: true });

mongoose.connect(config.get("database.url")).then(
    () => { 
        console.log('connected'); 
    },
    err => { 
        /** handle initial connection error */
        console.log(err);
    }
);

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

app.use(morgan('combined'));                       //logging
app.use(bodyParser.json());                        //parsing request body
app.use(bodyParser.urlencoded({ extended: true }));//parsing request queries
app.use(make_response_as_global);

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

// app.use(settings.headers);                         // Setting up resquest headers to support Angular applications
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
    next();
});
app.use('/api/users/', User_Route);//including routes to application
app.use('/api/users/address', Address_Route);//including routes to application
app.use('/api/users/', Login_Route);


/* Exception Handling for uncaught Exceptions*/
process.on('uncaughtException', function(err){
    console.log('\n Caught exception:'+ err);
    response.status(500).json({error: "500 internal server error"});
});


app.listen(2001,function(){
    console.log("Server is running on port 2001");
});
