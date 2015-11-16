var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var json = require('JSON');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/', function (req, res) {
	request('http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?callback=myFunction&symbol=' + req.body.text, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	body = body.replace("myFunction(","");
	    body = body.replace(")","");
	    var stock = JSON.parse(body);
	  	res.send(stock);
	  }
	});
});

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});