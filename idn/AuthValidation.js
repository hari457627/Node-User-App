var http = require('http');
var Q = require('q');
var token = require('../idn/AccessToken');
var moduleConfig = require('config');
var cache = require('memory-cache');
var uuid = null;

module.exports = {
    validateToken: function(userToken) {

        var def = Q.defer();
        var accessToken = token.getToken().access_token;
        var userCache = cache.get(userToken);
        // if (userCache) {
        //     def.resolve(userCache);
        // } else {
        var options = {
            host: 'api.qa1.nbos.io',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'X-N-ModuleKey': moduleConfig.get('MODULE_KEY')
            }
        };
        options.path = "/api/oauth/v0/tokens/" + userToken;
        var response = "";
        var req = http.request(options, function(res) {
            uuid = null;
            res.setEncoding('utf8');
            if (res.statusCode === 404) {
                def.reject("User not found");
            } else {
                res.on('data', function(chunk) {
                    response += chunk;
                });

                res.on('end', function() {
                    var json = JSON.parse(response);
                    if(json.hasOwnProperty('member')){
                        uuid = json.member.uuid;
                    }
                    else{
                        uuid = null;
                    }
                    var user = cache.put(json.token, json, 900000, function(key, value) {

                    });
                    def.resolve(json);
                });


            }
        }, function(res) {
            def.reject("error")
        });

        req.write("hello");
        req.end();
        // };
        return def.promise;
    },

    getUserId: function() {
        return uuid;
    }
};
