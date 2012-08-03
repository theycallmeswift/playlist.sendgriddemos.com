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

function getPlaybackToken(r, domain, cb) {
  r.makeRequest('getPlaybackToken', {domain: domain}, function(err, body) {
    if(err) { return cb(err); }

    cb(false, body.result);
  });
}

function getUsername(email) {
  var tokens = email.match(/([a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,4})/gi);
  return tokens[0].match(/^(.*)@(.*)$/)[1];
}

module.exports = {
  getTrack: getTrack,
  getPlaybackToken: getPlaybackToken,
  getUsername: getUsername
};
