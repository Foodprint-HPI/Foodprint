import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink
} from 'react-router-dom';
import Recorder from './Recorder';
import Statistics from './Statistics';
import './App.css';
import 'uikit/dist/css/uikit.min.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav class="uk-navbar-container uk-navbar">

            <div class="uk-navbar-left">

              <ul class="uk-navbar-nav">
                <li class="">
                  <NavLink exact={true} activeClassName='uk-active' to='/'>Recorder</NavLink>
                </li>
                <li>
                  <NavLink exact={true} activeClassName='uk-active' to='/statistics'>Statistics</NavLink>
                </li>
              </ul>
            </div>

          </nav>

          <Route exact path="/" component={Recorder} />
          <Route path="/statistics" component={Statistics} />
        </div>
      </Router>
    );
  }
}

export default App;
