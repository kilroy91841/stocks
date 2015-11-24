var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var json = require('JSON');
var numeral = require('numeral');
var parseString = require('xml2js').parseString;

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
				attachments += ", \"color\": \"danger\", \"fields\":[ { \"title\":\"" + stock.Symbol + "\", \"value\":\"Last Price: " + stock.LastPrice + ",  " + change + "    " + changePercent + "%\" } ]"
			} else {
				attachments += ", \"color\": \"good\", \"fields\":[ { \"title\":\"" + stock.Symbol + "\", \"value\":\"Last Price " + stock.LastPrice + ",  " + change + "    " + changePercent + "%\" } ]"
			}
			attachments += "} ]";
			res.setHeader("Content-type", "application/json");
			res.send("{ \"response_type\": \"in_channel\"," + attachments + " }");
			// request.post({
		 //    	url:'https://hooks.slack.com/services/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',
		 //    	form: "{ \"response_type\": \"in_channel\"," + attachments + " }"
		 //    }, function (error, response, body) {
		 //    	console.log("E " + error);
		 //    	console.log("R " + response);
		 //    	console.log("B " + body);
		 //    });	

			// res.send("Gimme one second while I fetch you the stock info on " + req.body.text);
		}
	  }
	});
});

app.post('/youlikethat', function (req, res) {
	res.setHeader("Content-type", "application/json");
	res.send("{ \"response_type\": \"in_channel\", \"text\":\"https://www.youtube.com/watch?v=bsB7UQ8BlE0\" }");
});

var KEY = '5dba0054-f270-46a2-8d89-2b5dd9917957';

app.post('/define', function (req, res) {
	var word = req.body.text;
	res.setHeader("Content-type", "application/json");
	res.send("Stop using me, I don't work");
	// request('http://www.dictionaryapi.com/api/v1/references/collegiate/xml/' + word + '?key=' + KEY, function (error, response, body) {
	// 	console.log(body);
	// 	parseString(body, function(err, result) {
	// 		if(err) {
	// 			res.send("Couldn't find a definition for that word, check your facts");
	// 		} else {
	// 			var linkIndex = 0;
	// 			var definition = result.entry_list.entry[0].def[0].dt[0]._;
	// 			console.log(definition);
	// 			while(definition.indexOf("  ") > 0) {
	// 				var index = definition.indexOf("  ");
	// 				definition = [definition.slice(0, index), " " + result.entry_list.entry[0].def[0].dt[0].d_link[linkIndex], definition.slice(index + 1)].join('')
	// 				linkIndex++;
	// 			}
	// 			definition = definition.replace(":","");
	// 			var attachments = "\"attachments\": [ {\"fallback\" : \"Hope you never see this!\""; 
	// 			attachments += ", \"color\": \"good\", \"fields\":[ { \"title\": \"" + word + "\", \"value\":\" " + definition + "\" } ]";
	// 			attachments += "} ]";
	// 			res.send("{ \"response_type\": \"in_channel\"," + attachments + " }");
	// 		}
	// 	});
	// });
});

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});