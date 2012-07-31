var express = require('express')
  , app = express.createServer()
  , config = require('./config.json')
  , helpers = require('./helpers.js')
  , Rdio = require('rdio-node').Rdio
  , playbackToken;

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
});

// Create a new instance
var r = new Rdio({
  consumerKey: config.Rdio.key,
  consumerSecret: config.Rdio.secret
});

app.post('/email', function(req,res) {
  console.log(req.body.subject);

  helpers.getTrack(r, req.body.subject, function(err, track) {
    console.log(track);
    res.end();
  });
});

helpers.getPlaybackToken(r, 'localhost', function(err, token) {
  playbackToken = token;
  app.listen(3000);
});
