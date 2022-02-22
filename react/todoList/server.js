var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var app = new (require('express'))();

var cfg = require('./webpack.dev.config');

//仅仅server.js改成var address = "0.0.0.0";会发生跨域问题
var address = 'localhost';
var port = '3300';

var compiler = webpack(cfg);

app.use(webpackDevMiddleware(compiler, {
	noInfo:false,
	publicPath: cfg.output.publicPath,
    inline: true,
    hot: true,
    quiet: false,
    stats: {colors: true}
}));
app.use(webpackHotMiddleware(compiler));

app.get("/", function(req, res) {
	// 排除favicon.ico请求
	if(req.url!=="/favicon.ico"){
    console.log(req.url);
  }
	res.sendFile(__dirname + '/index.html');
	res.end();
});

app.get('/test',function (req,res) {
    var data = {
        title:'2',
        content:'success'
    }
    res.send(data)
});

var server = app.listen(port, address, function(error) {
	if(error) {
		console.error(error);
	} else {
		console.info("==> Listening on port %s. Open up http://%s: %s/ in your browser.", port, address, port);
	}
});
