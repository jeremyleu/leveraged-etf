import React from 'react';


class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }



  componentDidMount() {
  }

  render() {
    return (
      <div className = "results">
        <h3>GROWTH RATES</h3>
        <hr />
        <div className = "cagr">
        </div>
      </div>
    )
  }
}

export default Results;
