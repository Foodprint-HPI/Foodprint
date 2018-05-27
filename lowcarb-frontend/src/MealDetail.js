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
            '#F1E57C',
            '#F1E57C',
            '#96C8A9',
            '#D16A76',
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
        <div class="uk-section uk-section-muted uk-padding-remove uk-margin-large-bottom">
          <div class="uk-container uk-margin-medium-top uk-margin-medium-bottom">
            <h1 class="uk-text-center">Your Carbon Foodprint<br />Lunch</h1>
          </div>
        </div>
        <canvas id="ctx" ref="diagram" width="95%" height="95%" style={{ "margin": "auto", "maxWidth": "500px" }}></canvas>
      </div>
    );
  }
}

export default MealDetail;
