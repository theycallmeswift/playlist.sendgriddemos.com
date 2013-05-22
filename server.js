/* playlist.sendgriddemos.com
 *
 * This is a demo application using SendGrid's parse and web APIs.  The
 * main idea is to create a crowdsourced playlist that's powered entirely
 * by email.  The music comes from Rdio and is transmitted to the clientside
 * by Socket.io
 */

// Dependencies
var express = require('express')
  , app = express.createServer()
  , port = process.env.PORT || 3000
  , pollingOnly = process.env.XHR_POLLING_ONLY || false
  , domain = process.env.DOMAIN || 'localhost'
  , io = require('socket.io').listen(app)
  , helpers = require('./helpers.js')
  , Rdio = require('rdio-node').Rdio
  , r
  , SendGrid = require('sendgrid').SendGrid
  , sendgrid;

// Configure the server
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
});

// Don't use Socket.io's WS support if flag is set
if(pollingOnly) {
  console.log("Alert: Polling disabled");
  io.configure(function() {
    io.set("transports", ["xhr-polling"]);
  });
}

// Create a new SendGrid object
sendgrid = new SendGrid(
  (process.env.SENDGRID_USER || 'your_sendgrid_username'),
  (process.env.SENDGRID_PASS || 'your_sendgrid_pass')
);

// Create a new connection to the Rdio API
r = new Rdio({
  consumerKey: (process.env.RDIO_KEY || 'your_rdio_key'),
  consumerSecret: (process.env.RDIO_SECRET || 'your_rdio_secret')
});

// Listen for posts to '/email' from sendgrid
app.post('/email', function(req,res) {
  console.log(req.body);
  var from = JSON.parse(req.body.envelope).from;

  // Look up the track on Rdio and emit an event
  helpers.getTrack(r, req.body.subject, function(err, track) {
    track.user = helpers.getUsernameFromEmail(from);

    if(!err && track) {
      io.sockets.emit('queue', track);
    } else {
      // If we couldn't locate the song, send the user an email notification
      sendgrid.send({
        to: from,
        from: 'playlist@sendgriddemos.com',
        subject: "Oops! We couldn't locate your song",
        text: "You searched for '" + req.body.subject + "', but we couldn't find anything!  Please try again."
      }, function(success, response) {
        if(!success) {
          console.log(response);
        }
      });
    }
  });
  res.end();
});

// Get a playback token that we can use to play songs from Rdio
helpers.getPlaybackToken(r, domain, function(err, token) {
  if(err) { throw JSON.stringify(err); }

  // Whenever we get a new connection, send the token to the client
  io.sockets.on('connection', function(socket) {
    socket.emit('token', token, domain);
  });

  app.listen(port);
});
