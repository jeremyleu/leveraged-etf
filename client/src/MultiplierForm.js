import React, { Component } from 'react';
import './MultiplierForm.css';
var moment = require('moment');
moment().format();

class MultiplierForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      multiplier: '2',
      multiplierSet: new Set(),
      multipliers: [],
      startMonth: '1',
      startDate: '2',
      startYear: '1986',
      start: '1986 1 2',
      endMonth: '' + (moment().month() + 1),
      endDate: '' + moment().date(),
      endYear: '' + moment().year(),
      end: moment().format('YYYY MM DD'),
      data: {},
      loading: false,
      multiplierError: null,
      dateError: null,
      multiplierAddError: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    var target = event.target;

    if(target.name === "addMultiplier"){
      this.setState(function(prevState, props){
        var newMultiplierSet = prevState.multiplierSet;
        var multiplierAddError = null;
        if(newMultiplierSet.has(this.state.multiplier))
          multiplierAddError = "That multiplier has already been added."
        else
          newMultiplierSet.add(this.state.multiplier);
        var multipliers = [];
        for(let mult of newMultiplierSet.values()){
          console.log(mult);
          multipliers.push(<button name = {mult} key = {mult} className="list-group-item list-group-item-action" onClick={this.handleClick}>{mult}</button>);
        }
        return {multiplier: '', multiplierSet: newMultiplierSet, multiplierAddError: multiplierAddError, multipliers: multipliers};
      });
    }
    else{
      this.setState(function(prevState, props){
        var newMultiplierSet = prevState.multiplierSet;

        newMultiplierSet.delete(target.name);
        var multipliers = [];
        for(let mult of newMultiplierSet.values()){
          multipliers.push(<button name = {mult} key = {mult} className="list-group-item list-group-item-action" onClick={this.handleClick}>{mult}</button>);
        }
        return {multiplier: '', multiplierSet: newMultiplierSet, multipliers: multipliers};
      });
    }
  }

  handleChange(event) {
    var target = event.target;
    //this.setState({error: null});
    this.setState({[target.name]: target.value}, function(){
      this.setState({start: this.state.startYear + ' ' + this.state.startMonth + ' ' + this.state.startDate, end: this.state.endYear + ' ' + this.state.endMonth + ' ' + this.state.endDate}, function(){
        if(target.name === "multiplier") {
          if(isNaN(target.value) || target.value < 1 || target.value > 5)
            this.setState({multiplierError: "Only positive numbers between 1 and 5 are valid."});
          else
            this.setState({multiplierError: null});
        }
        else {
          if(!(moment(this.state.end, "YYYY MM DD").isAfter(moment(this.state.start, "YYYY MM DD"))))
            this.setState({dateError: "The end date must be after the start date."});
          else
            this.setState({dateError: null});
        }
      });
    });

  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loading: true, multiplierAddError: null, multiplier: ''});
    fetch('/api/history')
      .then(res => res.json())
      .then(data => this.setState({data: data}, function(){
        console.log(this.state.multiplierSet);
        window.fillChart(this.state.data.allValues, this.state.data.allDates, this.state.multiplierSet, this.state.start, this.state.end);
        this.setState({loading: false});
        if(window.error) {
          this.setState({
            startMonth: '1',
            startDate: '2',
            startYear: '1986',
            start: '1986 1 2'
          });
        }
      }));
  }

  render() {
    var months = [parseInt(this.state.startMonth, 1), parseInt(this.state.endMonth, 1)];
    var years = [this.state.startYear, this.state.endYear];
    var days = [31, 31];
    for(var i = 0; i < months.length; i++) {
      if(months[i] === 4 || months[i] === 6 || months[i] === 9 || months[i] === 11)
        days[i] = 30;
      else if (months[i] === 2){
        if(years[i] % 4 === 0 && years[i] % 100 > 0)
          days[i] = 29;
        else
          days[i] = 28;
      }
      else
        days[i] = 31;
    }
    var monthsArray = [
      <option value = "1" key = "1">January</option>,
      <option value = "2" key = "2">February</option>,
      <option value = "3" key = "3">March</option>,
      <option value = "4" key = "4">April</option>,
      <option value = "5" key = "5">May</option>,
      <option value = "6" key = "6">June</option>,
      <option value = "7" key = "7">July</option>,
      <option value = "8" key = "8">August</option>,
      <option value = "9" key = "9">September</option>,
      <option value = "10" key = "10">October</option>,
      <option value = "11" key = "11">November</option>,
      <option value = "12" key = "12">December</option>
    ];
    var selectOptionsArrays = [];
    for(var i1 = 0; i1 < days.length; i1++) {
      var selectOptionsArray = [];
      for(var j = 1; j <= days[i1]; j++)
        selectOptionsArray.push(<option key = {j} value = {j}>{j}</option>);
      selectOptionsArrays.push(selectOptionsArray);
    }
    var yearOptions = [];
    for(var i2 = 1986; i2 <= (new Date().getFullYear()); i2++)
      yearOptions.push(<option key = {i2} value = {i2}>{i2}</option>);
    return (
      <div className = "multiplier-form-container">
        <form onSubmit={this.handleSubmit}>


          <div className = "form-inline">
            <div className = "form-group">
              <label htmlFor = "multiplier-input">
                Multiplier (1 - 5):
              </label>
              <input type="text" className="form-control" id="multiplier-input" name = "multiplier" value={this.state.multiplier} onChange={this.handleChange} />
              {this.state.multiplierError ? <button className="button btn btn-default" name = "addMultiplier" type = "button" onClick = {this.handleClick} disabled>Add</button> : <button className="button btn btn-default" name = "addMultiplier" type = "button"  onClick = {this.handleClick}>Add</button>}
            </div>
            <div className = "form-group">
              <label htmlFor = "multiplier-input">
                Start Date:
              </label>
              <select className="form-control" name = "startMonth" onChange = {this.handleChange} value = {this.state.startMonth}>
                {monthsArray}
              </select>
              <select className="form-control" name = "startDate" onChange = {this.handleChange} value = {this.state.startDate}>
                {selectOptionsArrays[0]}
              </select>
              <select className="form-control" name = "startYear" onChange = {this.handleChange} value = {this.state.startYear}>
                {yearOptions}
              </select>
            </div>
            <div className = "form-group">
              <label htmlFor = "multiplier-input">
                End Date:
              </label>
              <select className="form-control" name = "endMonth" onChange = {this.handleChange} value = {this.state.endMonth}>
                {monthsArray}
              </select>
              <select className="form-control" name = "endDate" onChange = {this.handleChange} value = {this.state.endDate}>
                {selectOptionsArrays[0]}
              </select>
              <select className="form-control" name = "endYear" onChange = {this.handleChange} value = {this.state.endYear}>
                {yearOptions}
              </select>
            </div>
            <div className = "form-group">
              {this.state.dateError ? <input type="submit" className="button btn btn-default" value="Submit" disabled/> : <input type="submit" className="button btn btn-default" value="Submit" />}
            </div>

          </div>
        </form>
        <br />
        {window.flag ? <div className="alert alert-info" role="alert">On {window.date}, the S&P 500 closed at {Math.round(window.change * 10000)/100}%, so at least one of the ETFs shown would lose all its value.</div> : null}
        {window.error ? <div className="alert alert-info" role="alert">{window.error}</div> : null}
        {this.state.multiplierAddError ? <div className="alert alert-warning" role="alert">{this.state.multiplierAddError}</div> : null}
        {this.state.dateError || this.state.multiplierError ? <div className="alert alert-danger" role="alert">{this.state.multiplierError} {this.state.dateError}</div> : null}
        {this.state.loading ? <div className="alert alert-info" role="alert">Loading...</div> : null} <br />
        {this.state.multipliers.length ? <div className = "multiplierListTitle"><strong>Current Multipliers:</strong></div> : null}
        <div className = "list-group">
          {this.state.multipliers}
        </div>
      </div>
    );
  }
}

export default MultiplierForm;
