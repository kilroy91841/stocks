var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var json = require('JSON');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/', function (req, res) {
	request('http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?callback=myFunction&symbol=' + req.body.text, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	body = body.replace("myFunction(","");
	    body = body.replace(")","");
	    var stock = JSON.parse(body);

	    var body2 = {};
	    body2["text"] = stock;

	    var bodyString = JSON.stringify(body2);
	    console.log(bodyString);

	    request.post({
	    	url:'https://hooks.slack.com/services/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',
	    	form: "{\"text\":\"" + stock.Symbol + "-- Last Price: " + stock.LastPrice + ", Change: " + stock.ChangePercent + "\"}"
	    }, function (error, response, body) {
	    	console.log("E " + error);
	    	console.log("R " + response);
	    	console.log("B " + body);
	    });	

	  	res.send("k");
	  }
	});
});

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});