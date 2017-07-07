import React, { Component } from 'react';
import './MultiplierForm.css';
var moment = require('moment');
moment().format();

class MultiplierForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: '^GSPC',
      multiplierSet: new Set(),
      data: {},
      loading: false,
      axis: 'linear'
    };

    this.multiplierChanged = this.multiplierChanged.bind(this);
    this.axisChanged = this.axisChanged.bind(this);
    this.symbolChanged = this.symbolChanged.bind(this);
  }

  symbolChanged(event) {
    var target = event.target;

    this.setState({
      symbol: target.value
    }, function(){
      this.redrawChart();
    });

  }

  multiplierChanged(event) {
    var target = event.target;
    let multiplierSetCopy = this.state.multiplierSet;

    if(target.checked) {
      multiplierSetCopy.add(target.value);
    }
    else {
      multiplierSetCopy.delete(target.value);
    }

    this.setState({
      multiplierSet: multiplierSetCopy
    }, function(){
      this.redrawChart();
    });


  }

  axisChanged(event) {
    var target = event.target;
    console.log('axisChanged ' + target.value);
    this.setState({
      axis: target.value
    }, function(){
      this.redrawChart();
    });

  }

  redrawChart () {
    console.log(this.state.symbol);
    this.setState({loading: true});
    fetch('/api/history?symbol=' + this.state.symbol)
      .then(res => res.json())
      .then(data => this.setState({data: data}, function(){
        window.fillChart(this.state.data, this.state.multiplierSet, this.state.axis, this.state.symbol);
        this.setState({loading: false});
      }));
  }

  componentDidMount() {
    this.redrawChart();
  }

  render() {

    return (
      <div className = "multiplier-form">
        <h1>OPTIONS</h1>
        <hr />
        <form>
          <br />

          <div>
            <div className = "form-label">
              Symbol:
            </div>
            <div className = "form-group row">
              <select className="form-control" name = "symbol" onChange = {this.symbolChanged} value = {this.state.symbol}>
                <option value = "^GSPC" key = "GSPC">S&P 500 (^GSPC)</option>,
                <option value = "^IXIC" key = "IXIC">NASDAQ (^IXIC)</option>
              </select>
            </div>
            <div className = "form-label">
              Multiplier(s):
            </div>
            <div className = "form-group row">
              <div className = "col-md-4">
                <input type="checkbox" id="multiplier-checkbox-2" className = "multiplier-checkbox" name="multiplier-2" value="2" onChange={this.multiplierChanged}/>
                <label htmlFor="multiplier-checkbox-2">2</label>
              </div>
              <div className = "col-md-4">
                <input type="checkbox" id="multiplier-checkbox-3" className = "multiplier-checkbox" name="multiplier-3" value="3" onChange={this.multiplierChanged}/>
                <label htmlFor="multiplier-checkbox-3">3</label>
              </div>
              <div className = "col-md-4">
                <input type="checkbox" id="multiplier-checkbox-4" className = "multiplier-checkbox" name="multiplier-4" value="4" onChange={this.multiplierChanged}/>
                <label htmlFor="multiplier-checkbox-4">4</label>
              </div>
            </div>

            <div className = "form-label">
              Axis:
            </div>
            <div className = "form-group row">
              <div className = "col-md-4">
                <input type="radio" id="linear-radio" className = "axis-radio" name="axis" value="linear" onChange={this.axisChanged} checked = {this.state.axis === 'linear'}/>
                <label htmlFor="linear-radio">Linear</label>
              </div>
              <div className = "col-md-8">
                <input type="radio" id="logarithmic-radio" className = "axis-radio" name="axis" value="logarithmic" onChange={this.axisChanged} checked = {this.state.axis === 'logarithmic'}/>
                <label htmlFor="logarithmic-radio">Logarithmic</label>
              </div>
            </div>


            <br />

          </div>
        </form>
        {window.flag ? <div className="alert alert-info" role="alert">On {window.date}, the S&P 500 closed at {Math.round(window.change * 10000)/100}%, so at least one of the ETFs shown would lose all its value.</div> : null}
        {this.state.loading ? <div className="alert alert-info" role="alert">Loading...</div> : null} <br />
      </div>
    );
  }
}

export default MultiplierForm;
