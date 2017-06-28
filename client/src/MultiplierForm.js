import React, { Component } from 'react';
//import './MultiplierForm.css';

class MultiplierForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', data: {}};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('/api/history')
      .then(res => res.json())
      .then(data => this.setState({data: data}, function(){
        window.fillChart(this.state.data.allValues, this.state.data.allDates, this.state.value);
      }));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Multiplier:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default MultiplierForm;
