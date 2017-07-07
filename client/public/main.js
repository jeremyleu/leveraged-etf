var Highcharts = require('highcharts/highstock');
var bootstrap = require('bootstrap');
var moment = require('moment');
moment().format();

var myChart;

window.fillChart = function(data, multiplierSet, axis, symbol) {


  let series = [{
      name: symbol,
      data: data,
      tooltip: {
          valueDecimals: 2
      }
  }]

  for(let multString of multiplierSet){
    let multiplier = Number(multString);
    let changes = [];
    for(let i = 0; i < data.length - 1; i++) {
      changes.push([data[i][0], (data[i + 1][1] - data[i][1])/data[i][1]]);
      if((data[i + 1][1] - data[i][1])/data[i][1] <= -1 || (data[i + 1][1] - data[i][1])/data[i][1] >= 1) {

      }
    }
    console.log(changes);
    let newdata = [];
    newdata.push(data[0]);
    for(let i = 0; i < changes.length; i++) {
      if(newdata[i][1] > 0){
        let next = newdata[i][1] * (1 + (changes[i][1] * multiplier));
        if(next > 0)
          newdata.push([data[i + 1][0], next]);
        else {
          newdata.push([data[i + 1][0], 0]);
          window.flag = true;

        }
      }
      else
        newdata.push([data[i + 1][0], 0]);
    }

    console.log(data);
    console.log(newdata);
    series.push({
      name: symbol + ' ' + multiplier + 'X ETF (Simulated)',
      data: newdata,
      tooltip: {
          valueDecimals: 2
      }
    });
  }

  console.log(axis);

  Highcharts.stockChart('myChart', {
        rangeSelector: {
            selected: 5
        },

        title: {
            text: 'Leveraged ETF Simulation'
        },

        yAxis: {
          type: axis,
        },

        series: series
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
