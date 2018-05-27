import React, { Component } from 'react';
import Chart from 'chart.js';

class DayView extends Component {
  render() {
    const days =  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const params = this.props.location.pathname.split("/");
    const day = days[params[params.length - 1]];
    const weekNumber = params[params.length -3];
    return (
      <div>
      <h3>Your Carbon Foodprint<br/>Week {weekNumber}<br/>Wednesday</h3>
        <div style={{textAlign: "center"}}>Imagine your daily consumption from that day could be available here. </div>
      </div>
    );
  }
}

export default DayView;
