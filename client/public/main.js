var Chart = require('chart.js');
var bootstrap = require('bootstrap');
var moment = require('moment');
moment().format();

var myChart;

window.fillChart = function(data, labels, multiplier, start, end) {
  if(myChart)
    myChart.destroy();
  var ctx = document.getElementById("myChart").getContext('2d');
  Chart.defaults.global.maintainAspectRatio = false;
  Chart.defaults.global.defaultFontFamily = 'Roboto';

  var datasets = [];
  window.flag = false;
  window.multiplier = multiplier;

  var startIndex = labels.indexOf(moment(start).format('YYYY-MM-DD'));
  var endIndex = labels.indexOf(moment(end).format('YYYY-MM-DD'));

  while(startIndex === -1){
    start = moment(start).add(1, 'days');
    startIndex = labels.indexOf(start.format('YYYY-MM-DD'));
  }

  while(endIndex === -1){
    end = moment(end).subtract(1, 'days');
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

  if(multiplier > 0){
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
      borderColor: '#9999FF'
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

$(function(){

});
