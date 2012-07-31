function getTrack(r, title, cb) {
  r.makeRequest('search', {query: title, types: 'Track'}, function(err, body) {
    if(err) { return cb(err); }

    cb(false, body.result.results[1].key);
  });
}

function getPlaybackToken(r, domain, cb) {
  r.makeRequest('getPlaybackToken', {domain: domain}, function(err, body) {
    if(err) { return cb(err); }

    cb(false, body.result);
  });
}

module.exports = {
  getTrack: getTrack,
  getPlaybackToken: getPlaybackToken
};
