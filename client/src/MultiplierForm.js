import React, { Component } from 'react';
import './MultiplierForm.css';
var moment = require('moment');
moment().format();

class MultiplierForm extends React.Component {
  constructor(props) {
    super(props);
    var currentDate = new Date();
    this.state = {
      multiplier: '',
      startMonth: '1',
      startDate: '2',
      startYear: '1986',
      start: '',
      endMonth: '' + (currentDate.getMonth() + 1),
      endDate: '' + currentDate.getDate(),
      endYear: '' + currentDate.getFullYear(),
      end: '',
      data: {},
      loading: false,
      multiplierError: null,
      dateError: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    var target = event.target;
    //this.setState({error: null});
    this.setState({[target.name]: target.value}, function(){
      this.setState({start: this.state.startYear + ' ' + this.state.startMonth + ' ' + this.state.startDate, end: this.state.endYear + ' ' + this.state.endMonth + ' ' + this.state.endDate}, function(){
        console.log("start: " + this.state.start);
        console.log("end: " + this.state.end);
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
    this.setState({loading: true});
    fetch('/api/history')
      .then(res => res.json())
      .then(data => this.setState({data: data}, function(){
        window.fillChart(this.state.data.allValues, this.state.data.allDates, this.state.multiplier, this.state.start, this.state.end);
        this.setState({loading: false});
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
    console.log(days[0]);
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
            </div>
            <div className = "form-group">
              <label htmlFor = "multiplier-input">
                Start Date:
              </label>
              <select className="form-control" name = "startMonth" onChange = {this.handleChange} value = {this.state.startMonth}>
                <option value = "1">January</option>
                <option value = "2">February</option>
                <option value = "3">March</option>
                <option value = "4">April</option>
                <option value = "5">May</option>
                <option value = "6">June</option>
                <option value = "7">July</option>
                <option value = "8">August</option>
                <option value = "9">September</option>
                <option value = "10">October</option>
                <option value = "11">November</option>
                <option value = "12">December</option>
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
                <option value = "1">January</option>
                <option value = "2">February</option>
                <option value = "3">March</option>
                <option value = "4">April</option>
                <option value = "5">May</option>
                <option value = "6">June</option>
                <option value = "7">July</option>
                <option value = "8">August</option>
                <option value = "9">September</option>
                <option value = "10">October</option>
                <option value = "11">November</option>
                <option value = "12">December</option>
              </select>
              <select className="form-control" name = "endDate" onChange = {this.handleChange} value = {this.state.endDate}>
                {selectOptionsArrays[0]}
              </select>
              <select className="form-control" name = "endYear" onChange = {this.handleChange} value = {this.state.endYear}>
                {yearOptions}
              </select>
            </div>
            <div className = "form-group">
              {this.state.dateError || this.state.multiplierError ? <input type="submit" className="button btn btn-default" value="Submit" disabled/> : <input type="submit" className="button btn btn-default" value="Submit" />}
            </div>

          </div>
        </form>
        <br />
        {window.flag ? <div className="alert alert-info" role="alert">On {window.date}, the S&P 500 closed at {Math.round(window.change * 10000)/100}%, so a hypothetical {window.multiplier}X ETF would lose all its value.</div> : null}
        {this.state.dateError || this.state.multiplierError ? <div className="alert alert-danger" role="alert">{this.state.multiplierError} {this.state.dateError}</div> : null}
        {this.state.loading ? <div className="alert alert-info" role="alert">Loading...</div> : null}
      </div>
    );
  }
}

export default MultiplierForm;
