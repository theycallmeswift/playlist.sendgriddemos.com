$(document).ready(function() {
  var socket = io.connect('/')
    , playing = false;

  // Listen for the Rdio token and create a new embeded player when we get it
  socket.on('token', function(token) {
    $("#api").rdio(token);
  });

  // When we're ready to start playing, start listening for queue events
  $("#api").on('ready.rdio', function(event) {
    socket.on('queue', function(data) {
      // Append a div containing the basic info about the request to the playlist
      $("#queue").append('<div class="request"><h2>'+data.name+'</h2> <h4 class="subheader">was requested by '+data.user+'</h4></div>');

      if(playing) {
        // If we're already playing a song, queue it up to be played next
        $("#api").rdio().queue(data.track);
      } else {
        // If we're not playing a song, start playing it and set the env variable
        $("#api").rdio().play(data.track);
        playing = true;
      }
    });
  });

  $('#api').bind('playingTrackChanged.rdio', function(e, track, pos) {
    // Whenever we start playing a new track switch out the icon, name, and artist
    if(track) {
      $("#art").html("<img src='"+track.icon+"' />");
      $("#track").html(track.name);
      $("#artist").html(track.artist);

      if($("#queue .request:first h2").html() == track.name) { $("#queue .request:first").remove(); }
    } else {
      playing = false;
    }
  });
});
