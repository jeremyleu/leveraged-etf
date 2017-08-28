const express = require('express');
const path = require('path');
const request = require('request');
const redis = require('redis');
var moment = require('moment');
var fs = require('fs');
var yahooFinance = require('yahoo-finance');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));


var timeSeries;

var client;
if(process.env.REDIS_URL)
  client = redis.createClient(process.env.REDIS_URL);
else
  client = redis.createClient();

client.on('connect', function() {
    console.log('connected to redis');
});

//process.env.TZ = "America/New_York";

app.get('/api/history', (req, res) => {
  client.get('latest' + req.query.symbol, function(err, reply){

    console.log(reply);

    if(!reply || reply !== moment().format('YYYY-MM-DD')){
      console.time("apiCall " + reply);
      yahooFinance.historical({
        symbol: req.query.symbol,
        from: reply || '1950-01-01',
        to: moment().format('YYYY-MM-DD'),
        period: 'd'
        // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
      }, function (err, quotes) {
        console.timeEnd("apiCall " + reply);
        client.set('latest' + req.query.symbol, moment().format('YYYY-MM-DD'));
        console.log('error:', err); // Print the error if one occurred
        //...
        //console.log(quotes);
        let allValues = [];
        if(!reply){
          for(let i = 0; i < quotes.length; i++) {
            if(Number(quotes[i].close) > 0) // bug in yahoo finance where it says NASDAQ closed at 0 on june 30, 2017
              allValues.push([parseInt(moment(quotes[i].date, "YYYY-MM-DD").format("x")), Number(quotes[i].close)]);
          }
          allValues.shift();
          allValues.reverse();
          client.set('allValues' + req.query.symbol, JSON.stringify(allValues));
          res.json(allValues);
        }
        else{
          client.get('allValues' + req.query.symbol, function(err, allValuesResponse){
            allValues = JSON.parse(allValuesResponse);
            quotes.reverse();

            for(let i = 0; i < quotes.length; i++) {
              if(Number(quotes[i].close) > 0)
                allValues.push([parseInt(moment(quotes[i].date, "YYYY-MM-DD").format("x")), Number(quotes[i].close)]);
            }
            client.set('allValues' + req.query.symbol, JSON.stringify(allValues));
            res.json(allValues);
          });

        }

      });
    }
    else{
      console.time("redisCall");
      client.get('allValues' + req.query.symbol, function(err, allValuesResponse){
        let allValues = JSON.parse(allValuesResponse);
        //console.log(allValues.slice(Math.max(allValues.length - 20, 1)));
        res.json(allValues);
      });
      console.timeEnd("redisCall");
    }
  });

});

app.use('/js', express.static(__dirname + '/client/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/client/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/client/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);
