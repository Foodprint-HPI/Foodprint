import React, { Component } from 'react';
import Chart from 'chart.js';

const data = {
  "co2": [{ week: "1", "value": 42 }, { week: "2", "value": 54 }],
  "limit": 50
};

class WeekView extends Component {
  graphClickEvent(event) {
    console.log(event);
    event.preventDefault();
    window.location.href = "/statistics/week/2/day/3"
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
            '#D16A76',
            '#96C8A9',
            '#89CBE4',
            '#F1E57C',
            '#783E67',
            '#35A3A5',
            '#CE478E',
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
        <div class="uk-section uk-section-muted uk-padding-remove uk-margin-large-bottom">
          <div class="uk-container uk-margin-medium-top uk-margin-medium-bottom">
            <h1 class="uk-text-center">Your Carbon Foodprint<br />Week {weekNumber}</h1>
          </div>
        </div>
        <canvas id="ctx" ref="diagram" width="95%" height="95%" style={{ "margin": "auto", "maxWidth": "500px" }}></canvas>
      </div>
    );
  }
}

export default WeekView;
