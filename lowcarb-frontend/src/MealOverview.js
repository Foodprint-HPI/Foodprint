import React, { Component } from 'react';
import Chart from 'chart.js';

const mealsByCarbonFootprint = [
  {
    "name": "Spaghetti",
    "date": "5/21/2018",
    "co2": "3.4"
  },
  {
    "name": "Spaghetti",
    "date": "5/21/2018",
    "co2": "3.4"
  },
  {
    "name": "Spaghetti",
    "date": "5/21/2018",
    "co2": "3.4"
  }
]

class MealOverview extends Component {
  graphClickEvent(event) {
    event.preventDefault();
    window.location.href = "/statistics/meal/lunch"
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
          label: 'kg CO2 consumption by Meal',
          data: [2, 2.4, 1.4, 3, 0.2],
          backgroundColor: [
            '#D16A76',
            '#96C8A9',
            '#89CBE4',
            '#F1E57C',
            '#783E67'
          ],
        }],
        labels: [
          "Breakfast", "Lunch", "Coffee", "Dinner", "Other"
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
            <h1 class="uk-text-center">Your Carbon Foodprint<br />Meals</h1>
          </div>
        </div>
        <canvas id="ctx" ref="diagram" width="95%" height="95%" style={{ "margin": "auto", "maxWidth": "500px" }}></canvas>
        <div style={{ "top": "100vh", position: "absolute", width: "100vw", height: "100vh" }}>
          <div style={{ "marginTop": "7vh" }} class="uk-section uk-section-muted uk-padding-remove uk-margin-large-bottom">
            <div class="uk-container uk-margin-medium-top uk-margin-medium-bottom">
              <h1 class="uk-text-center">Worst Meals<br />Meals</h1>
            </div>
          </div>

          <div class="uk-container">
            <table class="uk-table uk-table-hover uk-table-divider">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>CO2</th>
                </tr>
              </thead>
              <tbody>
                {mealsByCarbonFootprint.map((meal, key) => {
                  return <tr key={key}><td>{meal.name}</td><td>{meal.date}</td><td>{meal.co2}</td></tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default MealOverview;
