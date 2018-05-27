import React, { Component } from 'react';
import Chart from 'chart.js';

const data = {
  "co2": [{week: "1", "value": 42}, {week: "2", "value":54}],
  "limit": 50
};

class WeekView extends Component {
  graphClickEvent(event) {
    console.log(event);
    event.preventDefault();
    window.location.href="/statistics/week/2/day/3"
  }

  componentDidMount() {
    let ctx = this.refs.diagram.getContext("2d");

    var options = {
      onClick: this.graphClickEvent,
    }
    ctx = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Weekly CO2 consumption (kg)',
          data: [2, 2.4, 1.4, 3, 0.2, 0.5, 0.3],
          backgroundColor: [
                        'rgba(45, 136, 45, 0.2)',
                        'rgba(231, 12, 69, 0.2)',
                        'rgba(57, 21, 69, 0.2)',
                        'rgba(128, 21, 21, 0.2)',
                        'rgba(20, 240, 50, 0.2)',
                        'rgba(148, 138, 242, 0.2)',
                        'rgba(232, 166, 51, 0.2)',
                    ],
        }],
        labels: [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
    },
    options: options
  });
  }

  render() {
    const params = this.props.location.pathname.split("/");
    const weekNumber = params[params.length - 1];
    return (
      <div>
      <h3>Your Carbon Foodprint<br/>Week {weekNumber}</h3>
      <canvas id="ctx" ref="diagram" width="95%" height="95%" style={{"margin": "auto", "maxWidth": "500px"}}></canvas>
      </div>
    );
  }
}

export default WeekView;
