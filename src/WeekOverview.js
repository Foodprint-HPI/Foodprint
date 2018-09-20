import React, { Component } from 'react';
import Chart from 'chart.js';

const data = {
  "co2": [{ week: "1", "value": 42 }, { week: "2", "value": 54 }],
  "limit": 50
};

class WeekOverview extends Component {

  graphClickEvent(event) {
    event.preventDefault();
    window.location.href = "/statistics/week/2";
  }

  componentDidMount() {
    let ctx = this.refs.diagram.getContext("2d");

    var options = {
      onClick: this.graphClickEvent,

      // All of my other bar chart option here
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
    ctx = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Weekly CO2 consumption (kg)',
          data: [10, 13, 26, 14],
          backgroundColor: [
            "#96C8A9",
            "#96C8A9",
            "#D16A76",
            "#96C8A9"
          ],
        }, {
          label: 'Limit',
          data: [15, 15, 15, 15],
          pointBorderColor: 'rgba(128,21,21,0.2)',
          pointBackgroundColor: 'rgba(128,21,21,0.2)',
          borderColor: 'rgba(170, 57, 57,0.2)',
          backgroundColor: 'rgba(255,255,255,0)',

          // Changes this dataset to become a line
          type: 'line'
        }],
        labels: ['4/30', '5/7', '5/14', '5/21'],

      },
      options: options
    });
  }

  render() {
    return (
      <div>
        <div class="uk-section uk-section-muted uk-padding-remove uk-margin-large-bottom">
          <div class="uk-container uk-margin-medium-top uk-margin-medium-bottom">
            <h1 class="uk-text-center">Your Carbon Foodprint<br />(4 weeks)</h1>
          </div>
        </div>
        <canvas id="ctx" ref="diagram" width="95%" height="95%" style={{ "margin": "auto", "maxWidth": "500px" }}></canvas>
      </div>
    );
  }
}

export default WeekOverview;
