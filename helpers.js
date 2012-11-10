/* getTrack
 *
 * Search the Rdio API for a track with a given title.  Calls the callback
 * with the track ID, track name, and artist.
 *
 * @param   r       Rdio Object
 * @param   title   Title of the song
 * @param   cb      callback (err, result object)
 */
function getTrack(r, title, cb) {
  r.makeRequest('search', {query: title, types: 'Track'}, function(err, body) {
    if(err) { return cb(err); }

    var results = body.result.results[1];
    if(results) {
      cb(false, { track: results.key, name: results.name, artist: results.artist });
    } else {
      cb(false, false);
    }
  });
}

/* getPlaybackToken
 *
 * Returns a playback token to use with the Rdio embeded player.
 *
 * @param   r        Rdio Object
 * @param   domain   Domain for the app
 * @param   cb       callback (err, token)
 */
function getPlaybackToken(r, domain, cb) {
  r.makeRequest('getPlaybackToken', {domain: domain}, function(err, body) {
    if(err) { return cb(err); }

    cb(false, body.result);
  });
}

/* getUsernameFromEmail
 *
 * Pulls out everything up to the '@' sign of an email address and returns it.
 * Ex. 'swift@sendgrid.com' -> 'swift'
 *
 * @param   email   Email to extract username from
 * @return  String
 */
function getUsernameFromEmail(email) {
  console.log(email);
  return email.match(/^(.*)@(.*)$/)[1];
}

module.exports = {
  getTrack: getTrack,
  getPlaybackToken: getPlaybackToken,
  getUsernameFromEmail: getUsernameFromEmail
};
