var express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , helpers = require('./helpers.js')
  , Rdio = require('rdio-node').Rdio;

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
});

// Create a new instance
var r = new Rdio({
  consumerKey: (process.env.RDIO_KEY || 'your_rdio_key'),
  consumerSecret: (process.env.RDIO_SECRET || 'your_rdio_secret')
});

app.post('/email', function(req,res) {
  helpers.getTrack(r, req.body.subject, function(err, track) {
    track.user = helpers.getUsername(req.body.from);
    if(!err && track) {
      io.sockets.emit('queue', track);
    }
  });
  res.end();
});

helpers.getPlaybackToken(r, 'playlist.sendgriddemos.com', function(err, token) {
  if(err) { throw JSON.stringify(err); }

  io.sockets.on('connection', function(socket) {
    socket.emit('token', token);
  });

  app.listen(3000);
});
