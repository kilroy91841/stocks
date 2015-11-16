var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var json = require('JSON');
var numeral = require('numeral');

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

	    var change = numeral(stock.Change).format('+0.00');
	    var changePercent = numeral(stock.ChangePercent).format('+0.00');

	    console.log(stock);

	    if(stock.Message !== undefined) {
		    res.send("Couldn't find a stock price for that symbol, check your facts");
		} else {
			var attachments = "\"attachments\": [ {\"fallback\" : \"Hope you never see this!\""; 
			if(stock.ChangePercent < 0) {
				attachments += ", \"color\": \"danger\", \"fields\":[ { \"title\":\"" + stock.Symbol + "\", \"value\":\"Last Price: " + stock.LastPrice + ", " + change + " " + changePercent + "\" } ]"
			} else {
				attachments += ", \"color\": \"good\", \"fields\":[ { \"title\":\"" + stock.Symbol + "\", \"value\":\"Last Price " + stock.LastPrice + ", " + change + " " + changePercent + "\" } ]"
			}
			attachments += "} ]";
			request.post({
		    	url:'https://hooks.slack.com/services/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',
		    	form: "{" + attachments + " }"
		    }, function (error, response, body) {
		    	console.log("E " + error);
		    	console.log("R " + response);
		    	console.log("B " + body);
		    });	

			res.send("Gimme one second while I fetch you the stock info on " + req.body.text);
		}
	  }
	});
});

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});