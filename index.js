const express = require('express');
const path = require('path');
const request = require('request');

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

app.get('/indexHistory', (req, res) => {
  /*var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "", false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
  var response = JSON.parse(xhttp.responseText);*/
  request('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^GSPC&outputsize=full&apikey=7C3E6JIIQGJJI4B9', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if(response && response.statusCode == 200) {
      var timeSeries = JSON.parse(body)["Time Series (Daily)"];
      var dateStrings = Object.keys(timeSeries).sort();
      var closeValues = [];
      function pair(date, closeValue) {
        this.date = date;
        this.closeValue = closeValue;
      }
      for(var i = 0; i < dateStrings.length; i++) {
        closeValues.push(new pair(dateStrings[i], timeSeries[dateStrings[i]]["4. close"]));
      }
      res.json(closeValues);
    }
    //console.log('body:', body); // Print the HTML for the Google homepage.
  });


});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
