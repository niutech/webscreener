var system = require('system');
var page = require('webpage').create();

var url = system.args[1];
var width = system.args[2];
var height = system.args[3];
var format = system.args[4];
var quality = system.args[5];
page.settings.userAgent = system.args[6];

page.viewportSize = {
	width: width,
	height: height
};

console.log('Opening page: ' + url);

page.onInitialized = function () {
	console.log('Page initialized');
};
page.onLoadStarted = function () {
	console.log('Page load started');
};
page.onLoadFinished = function () {
	console.log('Page load finished');
};
page.onResourceTimeout = function (e) {
	console.log('Page timeout: ' + JSON.stringify(e));
};
page.onResourceError = function (e) {
	console.log('Page error: ' + JSON.stringify(e));
};

page.open(url, function (status) {
	console.log('Page opened with status: ' + status);
	page.render('tmp.' + format, {
		format: format,
		quality: quality
	});
	page.close();
	phantom.exit();
});
