var request = require('request');
var Q = require('q');
var buildConfig = require('config');
var accessToken = "";

module.exports = {
    getAccessToken: function() {
        var def = Q.defer();
        var options = {
            url: 'http://api.qa1.nbos.io/oauth/token?client_id='+buildConfig.get('MODULE_CLIENT_KEY')+"&client_secret="+buildConfig.get('MODULE_CLIENT_SECRET')+"&grant_type="+buildConfig.get('grant_type')+"&scope="+buildConfig.get('scope'),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Accept":"application/json"
            }
        };

        request.post(options, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                accessToken = JSON.parse(body); // Show the HTML for the Google homepage.
                def.resolve(body);
            } else {
                def.reject("error");
            }
        })
        return def.promise;
    },
    getToken: function() {
        return accessToken;
    }
}