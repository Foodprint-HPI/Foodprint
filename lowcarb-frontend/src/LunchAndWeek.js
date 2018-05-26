import React, { Component } from 'react';
import Chart from 'chart.js';

const data = {
  "co2": [{week: "1", "value": 42}, {week: "2", "value":54}],
  "limit": 50
};

class LunchAndWeek extends Component {

  graphClickEvent(event) {
    console.log(event);
  }

  componentDidMount() {
    let ctx = this.refs.diagram.getContext("2d");

    var options = {
      onClick: this.graphClickEvent,

    // All of my other bar chart option here
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
      }
    }
    ctx = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Weekly CO2 consumption',
          data: [10, 20, 30, 40],
          backgroundColor: [
                        'rgba(45, 136, 45, 0.2)',
                        'rgba(45, 136, 45, 0.2)',
                        'rgba(128, 21, 21, 0.2)',
                        'rgba(128, 21, 21, 0.2)',
                    ],
        }, {
          label: 'Limit',
          data: [20, 20, 20, 20],
          pointBorderColor: 'rgba(128,21,21,0.2)',
          pointBackgroundColor: 'rgba(128,21,21,0.2)',
          borderColor: 'rgba(170, 57, 57,0.2)',
          backgroundColor: 'rgba(255,255,255,0)',

          // Changes this dataset to become a line
          type: 'line'
        }],
        labels: ['1', '2', '3', '4'],
      },
      options: options
    });
  }

  render() {
    return (
      <div>
      <h3>Your Carbon Foodprint</h3>
      <canvas id="ctx" ref="diagram" width="95%" height="95%"></canvas>
      </div>
    );
  }
}

export default LunchAndWeek;
