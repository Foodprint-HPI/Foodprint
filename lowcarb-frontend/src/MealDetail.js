import React, { Component } from 'react';
import Chart from 'chart.js';

class MealDetail extends Component {

  componentDidMount() {
    let ctx = this.refs.diagram.getContext("2d");

    var options = {
    }
    ctx = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: 'kg CO2 consumption per Week',
          data: [2, 2.4, 1.4, 3, 0.2],
          backgroundColor: [
                        'rgba(45, 136, 45, 0.2)',
                        'rgba(231, 12, 69, 0.2)',
                        'rgba(57, 21, 69, 0.2)',
                        'rgba(128, 21, 21, 0.2)',
                    ],
        }],
        labels: ['4/30', '5/7', '5/14', '5/21'],
    },
    options: options
  });
  }

  render() {
    const params = this.props.location.pathname.split("/");
    const weekNumber = params[params.length - 1];
    return (
      <div>
      <h3>Your Carbon Foodprint<br/>Lunch</h3>
      <canvas id="ctx" ref="diagram" width="95%" height="95%" style={{"margin": "auto", "maxWidth": "500px"}}></canvas>
      </div>
    );
  }
}

export default MealDetail;
