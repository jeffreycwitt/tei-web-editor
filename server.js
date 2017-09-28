var express = require('express');
var request = require('request');
var crypto = require('crypto');
if (process.env.NODE_ENV === 'production'){
  var github = {
    "redirect": "https://tei-web-editor.herokuapp.com",
  	"url": "https://tei-web-editor.herokuapp.com",
  	"scope": "repo",
		"base": "https://github.com/",
  	"client": process.env.CLIENT_ID,
  	"secret": process.env.CLIENT_SECRET
  }
}
else {
  var github = require('./github.json')
}

// Create our app
//Oath pattern bascially follows https://github.com/keshavsaharia/github-oauth/blob/master/oauth.js
//I don't think all of it is need, or it could possible be simplified for our needs
//TODO: At the very least I think we should write detail comments for our selves


var app = express();

const PORT = process.env.PORT || 4567;

// Store access tokens with OTP keys (one-time passwords)
var token = {};
var redirect = {};


/**
 * GET /
 *
 * Redirect to the github OAuth flow
 */

app.get('/login', function(req, res) {

  res.statusCode = 302;

	// Generate a random state string and initialize the value for the key
	var state = crypto.randomBytes(16).toString('hex');
	token[state] = false;

	// Set the redirect if there is one
	redirect[state] = ((req.query.localhost) ?
		(github.localhost || 'http://localhost:8000') : github.redirect) +
		(req.query.redirect || '');

	// Redirect to GitHub
	res.setHeader('location',
		github.base + 'login/oauth/authorize?state=' + state
	  	+ '&client_id=' + github.client
	  	+ '&scope=' + github.scope
	  	+ '&redirect_uri=' + github.url + '/return'
	  );
	res.end();
});
app.get("/return", function(req, res, callback){
  // If there is no callback code
	if (! req.query.code)
		res.status(200).send('{ "error": "no_code" }');

	// If there is a mismatch in the random generated state (prevent cross-site attacks)
	else if (! req.query.state || token[req.query.state] !== false)
		res.status(200).send('{ "error": "invalid_state" }');

	// Retrieve the access token for the user
	else
	    request.get({
			url: github.base + 'login/oauth/access_token'
			  	 + '?client_id=' + github.client
			  	 + '&client_secret=' + github.secret
			  	 + '&code=' + req.query.code
			  	 + '&state=' + req.query.state,
			json: true
		},
		function (error, _, body) {
			if (error) {
				error.body = body;
				callback(error);
			}
			else {
				token[req.query.state] = body.access_token;
				//res.redirect(redirect[req.query.state] + '#token=' + req.query.state);
        res.cookie('access_token', body.access_token);
				res.redirect(redirect[req.query.state]);
				delete redirect[req.query.state];
			}
	    });

});

/**
 * 	GET /token?token=[one time password]
 *
 *  Passes the one-time query parameter
 */
app.get('/token', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');

	if (! req.query.token)
		res.status(200).send('{ "error": "no_token" }');

	else if (token[req.query.token] == null) {
		res.status(200).send('{ "error": "expired_token", "token": "' + req.query.token + '" }');
	}

	// One-time token handoff
	else {
		var t = token[req.query.token];
    delete token[req.query.token];
		res.status(200).send('{ "success": "true", "token": "' + t + '" }');
	}
});

app.use(express.static('dist'));

app.listen(PORT, function(){
  console.log("Express server is up on port" + PORT);
});
