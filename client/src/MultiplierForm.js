import React, { Component } from 'react';
import './MultiplierForm.css';

class MultiplierForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', data: {}, loading: false, error: null};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    if(isNaN(event.target.value) || event.target.value <= 0 || event.target.value > 5) {
      this.setState({error: "Please enter a valid positive number less than or equal to 5."});
    }
    else {
      this.setState({error: null})
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loading: true});
    fetch('/api/history')
      .then(res => res.json())
      .then(data => this.setState({data: data}, function(){
        window.fillChart(this.state.data.allValues, this.state.data.allDates, this.state.value)
        this.setState({loading: false});
      }));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <label>
          {this.state.loading ? <div class = "loading-message">Loading...</div> : <div class = "multiplier-message">Enter Multiplier between 0 and 5: </div>}
        </label>
        <div className = "input-group multiplierForm">
          <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} />
          <span className = "input-group-btn">
            {this.state.error ? <input type="submit" className="button btn btn-default" value="Submit" disabled/> : <input type="submit" className="button btn btn-default" value="Submit" />}
          </span>

        </div>
      </form>
    );
  }
}

export default MultiplierForm;
