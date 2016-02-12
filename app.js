var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var phantomPath = require('phantomjs').path;
var PORT = 3000;

var homepage = '<!DOCTYPE html>\
<html>\
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Webscreener</title></head>\
<body style="font: 14px sans-serif; text-align: center;"><form onsubmit="this.w.value=innerWidth;this.h.value=innerHeight;"><p>Enter URL: <input type="hidden" name="w" value="320"><input type="hidden" name="h" value="480"><input type="url" name="url" value="" placeholder="http://" size="50" required><input type="submit" value="Go"></p></form></body>\
</html>';

var options = {
	'timeout': 0,
	'userAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12B436 Safari/600.1.4',
	'format': 'jpg',
	'quality': 60
};

webscreener = function (url, width, height, callback) {
	var args = [
		path.join(__dirname, 'phantom.js'),
		url,
		width,
		height,
		options.format,
		options.quality,
		options.userAgent,
		'--ignore-ssl-errors=true',
		'--ssl-protocol=any'
	];
	console.log('Running: ' + phantomPath + ' ' + args.join(' ') + '\n');
	var phantom = spawn(phantomPath, args);
	phantom.stdout.on('data', function (data) {
		console.log(data.toString());
	});
	phantom.on('close', function (code) {
		fs.readFile('tmp.' + options.format, callback);
	});
};

http.createServer(function (req, res) {
	var params = url.parse(req.url, true);
	if (!params.query.url) {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.end(homepage);
		return;
	}
	var myUrl = url.format(url.parse(params.query.url));
	var myWidth = parseInt(params.query.w);
	var myHeight = parseInt(params.query.h);
	webscreener(myUrl, myWidth, myHeight, function (err, data) {
		if (err) {
			res.writeHead(500, {
				'Content-Type': 'text/plain'
			});
			res.end('500 Internal Server Error');
			console.error('Error: ', err);
		} else {
			res.writeHead(200, {
				'Content-Type': 'image/jpeg'
			});
			res.end(data);
		}
	});
}).listen(PORT, function () {
	console.log("Server started on http://127.0.0.1:" + PORT);
});
