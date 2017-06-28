var Chart = require('chart.js');
var bootstrap = require('bootstrap');

window.fillChart = function(data, labels, multiplier) {
  var ctx = document.getElementById("myChart").getContext('2d');
  Chart.defaults.global.maintainAspectRatio = false;
  Chart.defaults.global.defaultFontFamily = 'Roboto';

  var datasets = [];

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
      newdata.push(newdata[i] * (1 + (changes[i] * multiplier)));
    }
    datasets.push({
      label: '^GSPC ' + multiplier + 'X ETF (Simulated)',
      data: newdata,
      borderWidth: 1,
      fill: false,
      borderColor: '#9999FF'
    });
  }

  var myChart = new Chart(ctx, {

      type: 'line',
      data: {
          labels: labels,
          datasets: datasets
      },
      options: {
        maintainAspectRatio: 'false',
        responsive: 'false',
        scales: {
            yAxes: [{
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
