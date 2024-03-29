var http = require("http"),
  httpProxy = require("http-proxy");
//
// Create your proxy server and set the target in the options.
//
httpProxy.createProxyServer({ target: "http://localhost:9321" }).listen(8200); // See (†)

//
// Create your target server
//
http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write(
      "request successfully proxied!" +
        "\n" +
        JSON.stringify(req.headers, true, 2)
    );
    res.end();
  })
  .listen(9321);
