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
    window.location.href="/statistics/meal/lunch"
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
                        'rgba(45, 136, 45, 0.2)',
                        'rgba(231, 12, 69, 0.2)',
                        'rgba(57, 21, 69, 0.2)',
                        'rgba(128, 21, 21, 0.2)',
                        'rgba(20, 240, 50, 0.2)'
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
      <h3>Your Carbon Foodprint<br/>Meals</h3>
      <canvas id="ctx" ref="diagram" width="95%" height="95%" style={{"margin": "auto", "maxWidth": "500px"}}></canvas>
      <div style={{"top": "100vh", position: "absolute", width: "100vw", height: "100vh"}}>
      <h3 style={{"marginTop": "5vh"}}>Worst Meals</h3>
      <table class="uk-table">
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
    );
  }
}

export default MealOverview;
