import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink
} from 'react-router-dom';
import Recorder from './Recorder';
import Statistics from './Statistics';
import LunchAndWeek from './LunchAndWeek';
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
                <li class="uk-flex uk-flex-middle">
                  <img src="ressources/profile.jpg" class="profile" />
                </li>
              </ul>
            </div>
          </nav>
          </div>

          <Route exact path="/" component={Recorder}/>
          <Route exact path="/statistics" component={Statistics}/>
          <Route path="/statistics/lunchandweek" component={LunchAndWeek}/>
        </div>
      </Router>
    );
  }
}

export default App;
