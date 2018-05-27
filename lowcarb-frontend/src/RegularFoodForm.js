import React, { Component } from 'react';
import UIKit from 'uikit';


class RegularFoodForm extends Component {
  constructor(props) {
    super(props);
    this.availableMeals = ["Breakfast", "Lunch", "Coffee", "Dinner", "Other"];
    this.handleMealChange = this.handleMealChange.bind(this);
    this.state = {
      meal: "Coffee"
    }
  }

  handleMealChange(meal) {
    this.setState({
      meal: meal
    })
  }

  render() {
    return (
      <form class="uk-form-stacked" style={{paddingTop: "5vh", width: "95vw", margin: "auto"}}>
      <h3></h3>
      <div class="uk-margin">
        <div class="uk-form-controls">
          <button className="uk-button uk-button-default" type="button" style={{width: "100%", marginBottom: "10px"}}>{this.state.meal}</button>
          <div uk-dropdown="pos: bottom-justify">
          <ul className="uk-nav uk-dropdown-nav">
          {this.availableMeals.map((meal, key) => {
            if (this.state.meal === meal) {
              return <li key= {key} className="uk-active"><a href="#" onClick={() => this.handleMealChange(meal)}>{meal}</a></li>
            } else {
              return <li key={key}><a href="#" onClick={() => this.handleMealChange(meal)}>{meal}</a></li>
            }
          })}
          </ul>
          </div>
        </div>
      <div class="uk-margin">
        <div class="uk-form-controls">
          <input type="text" id="form-horizontal-text"  style={{width: "100% !important", marginBottom: "10px"}} className="uk-input uk-form-large" placeholder="Name of Meal" />
        </div>
      </div>
      </div>
      </form>
    );
  }
}

export default RegularFoodForm;
