const express = require('express');
const path = require('path');
const request = require('request');
const datesBefore2000 = require('./resources/datesbefore2000.json');
const valuesBefore2000 = require('./resources/valuesbefore2000.json')

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
/*app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )

  // Return them as json
  res.json(passwords);

  console.log(`Sent ${count} passwords`);
});*/
var timeSeries;
app.get('/api/history', (req, res) => {
  /*var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "", false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
  var response = JSON.parse(xhttp.responseText);*/
  request('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^GSPC&outputsize=full&apikey=7C3E6JIIQGJJI4B9', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if(response && response.statusCode == 200 && body && Object.keys(body).length > 0) {
      //console.log(body);
      if(JSON.parse(body)["Time Series (Daily)"])
        timeSeries = JSON.parse(body)["Time Series (Daily)"];
      //console.log(timeSeries);
      var dateStrings = Object.keys(timeSeries).sort();
      var closeValues = [];
      /*function pair(date, closeValue) {
        this.date = date;
        this.closeValue = closeValue;
      }*/
      for(var i = 0; i < dateStrings.length; i++) {
        closeValues.push(timeSeries[dateStrings[i]]["4. close"]);
      }
      var allDates = datesBefore2000.concat(dateStrings);
      var allValues = valuesBefore2000.concat(closeValues);
      res.json({allDates, allValues});
    }
    //console.log('body:', body); // Print the HTML for the Google homepage.
  });


});

app.use('/js', express.static(__dirname + '/client/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/client/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/client/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});



const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
