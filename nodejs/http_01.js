const http = require('http');

function getTestPersonaLoginCredentials(callback) {
  return http.get({
    host: 'www.baidu.com',
    path: '/'
  }, function(response) {
    var body = '';

    response.on('data', function(d) {
      body += d;
    });

    response.on('end', function() {
      var parsed = body;
      callback(parsed);
    });
  });
}

getTestPersonaLoginCredentials(console.log)