$(document).ready(function() {
  var socket = io.connect('/')
    , playing = false;

  // Create a new global Rdio object
  window.rdio = {};

  // Embed a new Rdio player
  function embedRdio(token, domain) {
    swfobject.embedSWF(
      'http://www.rdio.com/api/swf/',
      'api', 1, 1, '9.0.0', 'expressInstall.swf',
      { 'playbackToken': token, 'domain': domain, 'listener': 'rdio' },
      { 'allowScriptAccess': 'always' },
      { }
    );
  }

  rdio.ready = function ready() {
    var player = $("#api").get(0);

    // When we're ready to start playing, start listening for queue events
    socket.on('queue', function(data) {
      // Append a div containing the basic info about the request to the playlist
      $("#queue").append('<div class="request"><h2>'+data.name+'</h2> <h4 class="subheader">was requested by '+data.user+'</h4></div>');

      if(playing) {
        // If we're already playing a song, queue it up to be played next
        player.rdio_queue(data.track);
      } else {
        // If we're not playing a song, start playing it and set the env variable
        player.rdio_play(data.track);
      }
    });
  };

  rdio.playStateChanged = function playStateChanged(playState) {
    if(playState === 2) {
      playing = false;
    } else if(playState === 1) {
      playing = true;
    }
  };

  rdio.playingTrackChanged = function playingTrackChanged(track, sourcePosition) {
    if(!track) return;

    // Whenever we start playing a new track switch out the icon, name, and artist
    $("#art").html("<img src='"+track.icon+"' />");
    $("#track").html(track.name);
    $("#artist").html(track.artist);

    if($("#queue .request:first h2").html() == track.name) { $("#queue .request:first").remove(); }
  };

  // Listen for the Rdio token and create a new embeded player when we get it
  socket.on('token', function(token, domain) {
    embedRdio(token, domain);
  });
});

