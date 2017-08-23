import React from 'react';
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
      axis: 'linear',
      startMonth: '1',
      startDate: '1',
      startYear: '1950',
      start: '1950 1 1',
      endMonth: '' + (moment().month() + 1),
      endDate: '' + moment().date(),
      endYear: '' + moment().year(),
      end: moment().format('YYYY MM DD'),
      initialInvestment: 10000,
      errors: {}
    };

    this.multiplierChanged = this.multiplierChanged.bind(this);
    this.axisChanged = this.axisChanged.bind(this);
    this.symbolChanged = this.symbolChanged.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.investmentChanged = this.investmentChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  symbolChanged(event) {
    var target = event.target;

    this.setState({
      symbol: target.value
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
    });


  }

  axisChanged(event) {
    var target = event.target;
    this.setState({
      axis: target.value
    });

  }

  handleChange(event) {
    var target = event.target;
    this.setState({ [target.name]: target.value}, function(){
      this.setState({
        start: this.state.startYear + ' ' + this.state.startMonth + ' ' + this.state.startDate,
        end: this.state.endYear + ' ' + this.state.endMonth + ' ' + this.state.endDate
      }, function(){
        if(moment(this.state.start, "YYYY-MM-DD").isBefore(moment(this.state.end, "YYYY-MM-DD")) && moment(this.state.start, "YYYY-MM-DD").isBefore(moment())){
          let temp = this.state.errors;
          delete temp.startAfterEndError;
          this.setState({
            errors: temp
          });
        }
        else {
          let temp = this.state.errors;
          temp.startAfterEndError = "The start date must be before the current date and the end date. ";
          this.setState({
            errors: temp
          })
        }
      });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("hello");
    this.redrawChart();
  }

  investmentChanged(event) {
    let target = event.target;
    this.setState({
      initialInvestment: target.value
    }, function(){
      if(!(Number.isNaN(Number(target.value))) && Number(target.value) > 0){
        let temp = this.state.errors;
        delete temp.invalidInvestmentError;
        this.setState({
          errors: temp
        });
      }
      else {
        let temp = this.state.errors;
        temp.invalidInvestmentError = "The initial investment must be a valid positive number. ";
        this.setState({
          errors: temp
        })
      }
    });


  }

  redrawChart () {

    let displayErrors = false;
    for(let error in this.state.errors){
      if(this.state.errors.hasOwnProperty(error))
        displayErrors = true;
    }
    if(!displayErrors){
      console.time("fetch");
      this.setState({loading: true});
      fetch('/api/history?symbol=' + this.state.symbol)
        .then(res => res.json())
        .then(data => this.setState({data: data}, function(){
          window.fillChart(this.state.data, this.state.multiplierSet, this.state.axis, this.state.symbol, this.state.start, this.state.end, this.state.initialInvestment);
          this.setState({loading: false});
          console.timeEnd("fetch");
        }));
    }
  }

  componentDidMount() {
    this.redrawChart();
  }

  render() {
    var months = [parseInt(this.state.startMonth, 10), parseInt(this.state.endMonth, 10)];
		var years = [this.state.startYear, this.state.endYear];
		var days = [31, 31];
		for(let i = 0; i < months.length; i++) {
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
		for(let i1 = 0; i1 < days.length; i1++) {
			var selectOptionsArray = [];
			for(let j = 1; j <= days[i1]; j++)
			  selectOptionsArray.push(<option key = {j} value = {j}>{j}</option>);
			selectOptionsArrays.push(selectOptionsArray);
		}
		var yearOptions = [];
    let startYear = 2000;
    if(this.state.symbol === '^GSPC')
      startYear = 1950;
    else if(this.state.symbol === '^IXIC')
      startYear = 1971;
		for(let i2 = startYear; i2 <= (new Date().getFullYear()); i2++)
			yearOptions.push(<option key = {i2} value = {i2}>{i2}</option>);
    let displayErrors = false;
    for(let error in this.state.errors){
      if(this.state.errors.hasOwnProperty(error))
        displayErrors = true;
    }

    return (
      <div className = "multiplier-form">

        <h1>OPTIONS</h1>
        <hr />
        {this.state.loading ? <div className="alert alert-info" role="alert">Loading...</div> : null}
        {displayErrors ? <div className="alert alert-danger" role="alert">{Object.values(this.state.errors)}</div> : null}
        <form>
          <br />

          <div>
            <div className = "form-label">
              Index:
            </div>
            <div className = "form-group row">
              <select className="form-control" name = "symbol" onChange = {this.symbolChanged} value = {this.state.symbol}>
                <option value = "^GSPC" key = "GSPC">S&P 500 (^GSPC)</option>,
                <option value = "^IXIC" key = "IXIC">NASDAQ (^IXIC)</option>
              </select>
            </div>

            <div className = "form-label">
              Initial Investment:
            </div>
            <div className = "form-group row">
              <input type = "text" className = "form-control" onChange = {this.investmentChanged} value = {this.state.initialInvestment} />
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

            <div className = "form-label">
              Start Date:
            </div>
            <div className = "form-group row date-select">
              <div className = "col-md-5">
                <select className="form-control" name = "startMonth" onChange = {this.handleChange} value = {this.state.startMonth}>
                  {monthsArray}
                </select>
              </div>
              <div className = "col-md-3">
                <select className="form-control" name = "startDate" onChange = {this.handleChange} value = {this.state.startDate}>
                  {selectOptionsArrays[0]}
                </select>
              </div>
              <div className = "col-md-4">
                <select className="form-control" name = "startYear" onChange = {this.handleChange} value = {this.state.startYear}>
                  {yearOptions}
                </select>
              </div>
            </div>

            <div className = "form-label">
              End Date:
            </div>
            <div className = "form-group row date-select">
              <div className = "col-md-5">
                <select className="form-control" name = "endMonth" onChange = {this.handleChange} value = {this.state.endMonth}>
                  {monthsArray}
                </select>
              </div>
              <div className = "col-md-3">
                <select className="form-control" name = "endDate" onChange = {this.handleChange} value = {this.state.endDate}>
                  {selectOptionsArrays[1]}
                </select>
              </div>
              <div className = "col-md-4">
                <select className="form-control" name = "endYear" onChange = {this.handleChange} value = {this.state.endYear}>
                  {yearOptions}
                </select>
              </div>
            </div>
            <br />

            <button type = "submit" className = "btn btn-default" onClick = {this.handleSubmit}>Submit</button>



            <br />
            <br />

          </div>
        </form>
        {window.flag ? <div className="alert alert-info" role="alert">On {window.date}, the S&P 500 closed at {Math.round(window.change * 10000)/100}%, so at least one of the ETFs shown would lose all its value.</div> : null}

      </div>
    );
  }
}

export default MultiplierForm;
