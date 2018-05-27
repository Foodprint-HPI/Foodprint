import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink
} from 'react-router-dom';
import Recorder from './Recorder';
import Statistics from './Statistics';
import WeekOverview from './WeekOverview';
import WeekView from './WeekView';
import DayView from './DayView';
import MealOverview from './MealOverview';
import MealDetail from './MealDetail';
import RegularFoodForm from './RegularFoodForm';
import './App.css';
import 'uikit/dist/css/uikit.min.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
        <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">
          <nav class="uk-navbar-container uk-navbar">
            <div class="uk-navbar-left">
              <h1 class="logo">FOODPRINT</h1>
            </div>

            <div class="uk-navbar-right">

              <ul class="uk-navbar-nav">
                <li class="">
                  <NavLink exact={true} activeClassName='uk-active' to='/'>Recorder</NavLink>
                </li>
                <li>
                  <NavLink exact={true} activeClassName='uk-active' to='/statistics'>Statistics</NavLink>
                </li>
                <li>
                  <NavLink exact={true} activeClassName='uk-active' to='/statistics/week'>History</NavLink>
                </li>
                <li>
                  <NavLink exact={true} activeClassName='uk-active' to='/statistics/meal'>Meals</NavLink>
                </li>
              </ul>
            </div>
          </nav>
          </div>

          <Route exact path="/" component={Recorder}/>
          <Route exact path="/regular" component={RegularFoodForm}/>
          <Route exact path="/statistics" component={Statistics}/>
          <Route exact path="/statistics/week" component={WeekOverview}/>
          <Route exact path="/statistics/week/:weekId" component={WeekView}/>
          <Route exact path="/statistics/week/:weekId/day/:dayId" component={DayView}/>
          <Route exact path="/statistics/meal" component={MealOverview}/>
          <Route exact path="/statistics/meal/:mealtime" component={MealDetail}/>
        </div>
      </Router>
    );
  }
}

export default App;
