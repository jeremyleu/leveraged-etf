import React, { Component } from 'react';
import MultiplierForm from './MultiplierForm';
import './App.css';

class App extends Component {
  // Initialize state
  state = { data: {} }

  // Fetch passwords after first mount
  componentDidMount() {
    //this.getCloseValues();
    //console.log(this.state);
    //window.fillChart(this.state.data.closeValues, this.state.data.labels);
  }

  /*getCloseValues = () => {
    // Get the passwords and store them in state
    fetch('/api/history')
      .then(res => res.json())
      .then(data => this.setState({data: data}, function(){
        window.fillChart(this.state.data.allValues, this.state.data.allDates, 0);
      }));

  }*/

  render() {

    return (
      <div className = "container-fluid">
        <div className = "content-container">
          <div className = "multiplier-form-container">
            <MultiplierForm />
          </div>
          <br />
          <div className = "chart-container">
            <div id="myChart"></div>
          </div>
        </div>
      </div>

      //<div className="App">
        //{/* Render the passwords if we have them */}
        //{JSON.stringify(closeValues)}
      //</div>
    );
  }
}

export default App;
