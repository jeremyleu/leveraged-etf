var Chart = require('chart.js');
var bootstrap = require('bootstrap');
var moment = require('moment');
moment().format();

var myChart;

window.fillChart = function(data, labels, multiplierSet, start, end) {
  if(myChart)
    myChart.destroy();
  var ctx = document.getElementById("myChart").getContext('2d');
  Chart.defaults.global.maintainAspectRatio = false;
  Chart.defaults.global.defaultFontFamily = 'Roboto';

  var datasets = [];
  window.flag = false;
  window.error = null;
  //window.multiplier = multiplier;

  var startIndex = labels.indexOf(moment(start, "YYYY MM DD").format('YYYY-MM-DD'));
  var endIndex = labels.indexOf(moment(end, "YYYY MM DD").format('YYYY-MM-DD'));

  while(startIndex === -1){
    start = moment(start, "YYYY MM DD").add(1, 'days');
    startIndex = labels.indexOf(start.format('YYYY-MM-DD'));
    if(moment(start, "YYYY MM DD").isAfter(moment())) {
      window.error = "There is no data for the chosen start date, so the default start date was chosen. Please choose an earlier start date.";
      startIndex = 0;
    }
  }

  while(endIndex === -1){
    end = moment(end, "YYYY MM DD").subtract(1, 'days');
    endIndex = labels.indexOf(end.format('YYYY-MM-DD'));
  }

  data = data.slice(startIndex, endIndex + 1);
  labels = labels.slice(startIndex, endIndex + 1);

  datasets.push({
      label: '^GSPC Closing Price ($)',
      data: data,
      borderWidth: 1,
      fill: false
  });

  var colorIndex = 0;

  for(let multString of multiplierSet){
    var multiplier = Number(multString);
    console.log(multiplier);
    var changes = [];
    for(var i = 0; i < data.length - 1; i++) {
      changes.push((data[i + 1] - data[i])/data[i]);
    }
    var newdata = [];
    newdata.push(data[0]);
    for(var i = 0; i < changes.length; i++) {
      if(newdata[i] > 0){
        var next = newdata[i] * (1 + (changes[i] * multiplier));
        if(next > 0)
          newdata.push(next);
        else {
          newdata.push(0);
          window.flag = true;
          window.date = labels[i];
          window.change = changes[i];
        }
      }
      else
        newdata.push(0);
    }
    datasets.push({
      label: '^GSPC ' + multiplier + 'X ETF (Simulated)',
      data: newdata,
      borderWidth: 1,
      fill: false,
      borderColor: window.getRandomColor()
    });
  }


  myChart = new Chart(ctx, {

      type: 'line',
      data: {
          labels: labels,
          datasets: datasets
      },
      options: {
        //animation: 'false',
        maintainAspectRatio: 'false',
        responsive: 'false',
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Daily Close ($)'
              },
              ticks: {
                  beginAtZero: false
              }
            }]
        }
      }
  });


}

window.getRandomColor = function() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

$(function(){

});
