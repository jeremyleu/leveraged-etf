var Highcharts = require('highcharts/highstock');
var bootstrap = require('bootstrap');
var moment = require('moment');
moment().format();

var myChart;

window.fillChart = function(data, multiplierSet, axis, symbol, start, end, initialInvestment) {

  let selectedData = [];
  let started = false;
  let numShares = 0;
  let averageGrowthRates = [];
  let startDate = moment(start, "YYYY-MM-DD");
  let endDate = moment(end, "YYYY-MM-DD");

  console.log(data);
  console.time("selection");
  for(let i = 0; i < data.length; i++) {
    if(parseInt(startDate.format("x"), 10) <= data[i][0] && parseInt(endDate.format("x"), 10) >= data[i][0]) {

      if(!started){
        started = true;
        numShares = Number(initialInvestment/data[i][1]);
      }
      selectedData.push([data[i][0], data[i][1] * numShares]);
    }
  }
  console.timeEnd("selection");

  data = selectedData;

  //console.log(endDate.diff(startDate, 'days')/365.2422);
  let averageGrowthRate = {};
  averageGrowthRate.name = symbol;
  console.log(data);
  averageGrowthRate.growthRate = Math.pow(data[data.length - 1][1]/data[0][1], 1/((endDate.diff(startDate, 'days')/365.2422)));
  averageGrowthRates.push(averageGrowthRate);
  console.log(averageGrowthRate);

  let series = [{
      name: symbol + ' | CAGR: ' + ((averageGrowthRate.growthRate - 1) * 100).toFixed(3) + '%',
      data: data,
      tooltip: {
          valueDecimals: 2
      }
  }]

  console.time("calculation");
  for(let multString of multiplierSet){
    let multiplier = Number(multString);
    let changes = [];
    for(let i = 0; i < data.length - 1; i++)
      changes.push([data[i][0], (data[i + 1][1] - data[i][1])/data[i][1]]);
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

    let newAverageGrowthRate = {};
    newAverageGrowthRate.name = symbol + ' ' + multiplier + 'X ETF (Simulated)';
    newAverageGrowthRate.growthRate = Math.pow(newdata[newdata.length - 1][1]/newdata[0][1], 1/((endDate.diff(startDate, 'days')/365.2422)));
    averageGrowthRates.push(newAverageGrowthRate);
    //console.log(data);
    //console.log(newdata);
    series.push({
      name: symbol + ' ' + multiplier + 'X ETF (Simulated) | CAGR: ' + ((newAverageGrowthRate.growthRate - 1) * 100).toFixed(3) + '%',
      data: newdata,
      tooltip: {
          valueDecimals: 2
      }
    });



  }
  console.timeEnd("calculation");

  var cagrDiv = document.getElementsByClassName("cagr")[0];
  cagrDiv.innerHTML = "";
  for(let i = 0; i < averageGrowthRates.length; i++){
    console.log(averageGrowthRates[i]);
    cagrDiv.innerHTML += "<div><strong>" + averageGrowthRates[i].name + "</strong>: " + ((averageGrowthRates[i].growthRate - 1) * 100).toFixed(3) + "%</div>";
  }
  console.log(cagrDiv.innerHTML);

  console.log(averageGrowthRates);

  console.time("render");
  Highcharts.stockChart('myChart', {
        style: {
            fontFamily: 'Roboto'
        },
        rangeSelector: {
            inputEnabled: false,
            enabled: false
        },

        navigator: {
          enabled: false
        },

        title: {
            text: 'LEVERAGED ETF SIMULATION',
            style: {
              "fontSize": "2em",
              "fontWeight": "700"
            }
        },

        yAxis: {
          type: axis,
        },

        series: series,

        legend: {
          enabled: true,
          itemStyle: {
            font: '1.5em Roboto, Calibri, sans-serif',
            width: 350
          }
        }
  });

}
console.timeEnd("render");

window.getRandomColor = function() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

$(function(){

});
