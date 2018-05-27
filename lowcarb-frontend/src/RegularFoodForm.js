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
      <main>
        <div class="uk-section uk-section-muted uk-padding-remove uk-margin-large-bottom">
          <div class="uk-container uk-margin-medium-top uk-margin-medium-bottom">
            <h1 class="uk-text-center">Create a regular meal.</h1>
          </div>
        </div>
        <div class="uk-container">
          <form class="uk-form-stacked">

            <div class="uk-margin">
              <div class="uk-form-controls">
                <button className="uk-button uk-button-default" type="button" style={{ width: "100%", marginBottom: "10px" }}>{this.state.meal}</button>
                <div uk-dropdown="pos: bottom-justify">
                  <ul className="uk-nav uk-dropdown-nav">
                    {this.availableMeals.map((meal, key) => {
                      if (this.state.meal === meal) {
                        return <li key={key} className="uk-active"><a href="#" onClick={() => this.handleMealChange(meal)}>{meal}</a></li>
                      } else {
                        return <li key={key}><a href="#" onClick={() => this.handleMealChange(meal)}>{meal}</a></li>
                      }
                    })}
                  </ul>
                </div>
              </div>
              <div class="uk-margin">
                <div class="uk-form-controls">
                  <input type="text" id="form-horizontal-text" style={{ width: "100% !important", marginBottom: "10px" }} className="uk-input uk-form-large" placeholder="Name of Meal" />
                </div>
              </div>
              <button class="uk-button uk-button-default">Add Meal</button>
            </div>
          </form>
        </div>
      </main>
    );
  }
}

export default RegularFoodForm;
