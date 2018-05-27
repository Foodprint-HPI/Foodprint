import React, { Component } from 'react';
import UIkit from 'uikit';
import Chart from 'chart.js';
import './Statistics.css'

class Statistics extends Component {

  constructor() {
    super();

    this.state = {
      current: 0,
      number_trees: 0,
      trees: [],
      number_cars: 0,
      cars: [],
      number_cows: 0,
      cows: []

    }

    this.weeklyGoal = 50;

    this.baseUrl = "https://veggiefy.herokuapp.com/api/v1/";
    this.fetchCO2();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.current != nextState.current){
      console.log('update');
      const number_trees = Math.round(nextState.current / 0.42 * 10) / 10;
      const trees = this.duplicateTemplate(number_trees / 10, this.treeTemplate);

      const number_cars = Math.round(nextState.current * 2.25 * 10) / 10;
      const cars = this.duplicateTemplate(number_cars / 10, this.carTemplate);

      const number_cows = Math.round(nextState.current / 5.1 * 10) / 10;
      const cows = this.duplicateTemplate(number_cows, this.cowTemplate);
      this.setState({
        number_trees: number_trees,
        trees: trees,
        number_cars: number_cars,
        cars: cars,
        number_cows: number_cows,
        cows: cows
      });
    }

  }

  fetchCO2(data) {
    fetch(this.baseUrl + 'week/now', { method: "POST" })
      .then(response => {
        response.json()
          .then(currentCarbon => {
            this.setState({ current: Math.round(currentCarbon.result * 10) / 10 });
          });
      });
  }

  componentDidMount() {

    function getBoxWidth(labelOpts, fontSize) {
      return labelOpts.usePointStyle ?
        fontSize * Math.SQRT2 :
        labelOpts.boxWidth;
    };

    Chart.NewLegend = Chart.Legend.extend({
      afterFit: function () {
        this.height = this.height + 40;
      },
    });

    function createNewLegendAndAttach(chartInstance, legendOpts) {
      var legend = new Chart.NewLegend({
        ctx: chartInstance.chart.ctx,
        options: legendOpts,
        chart: chartInstance
      });

      if (chartInstance.legend) {
        Chart.layoutService.removeBox(chartInstance, chartInstance.legend);
        delete chartInstance.newLegend;
      }

      chartInstance.newLegend = legend;
      Chart.layoutService.addBox(chartInstance, legend);
    }

    // Register the legend plugin
    Chart.plugins.register({
      beforeInit: function (chartInstance) {
        var legendOpts = chartInstance.options.legend;

        if (legendOpts) {
          createNewLegendAndAttach(chartInstance, legendOpts);
        }
      },
      beforeUpdate: function (chartInstance) {
        var legendOpts = chartInstance.options.legend;

        if (legendOpts) {
          legendOpts = Chart.helpers.configMerge(Chart.defaults.global.legend, legendOpts);

          if (chartInstance.newLegend) {
            chartInstance.newLegend.options = legendOpts;
          } else {
            createNewLegendAndAttach(chartInstance, legendOpts);
          }
        } else {
          Chart.layoutService.removeBox(chartInstance, chartInstance.newLegend);
          delete chartInstance.newLegend;
        }
      },
      afterEvent: function (chartInstance, e) {
        var legend = chartInstance.newLegend;
        if (legend) {
          legend.handleEvent(e);
        }
      }
    });

    var myChart = new Chart("myChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 20, 30, 20],
          backgroundColor: [
            "#D16A76",
            "#89CBE4",
            "#F1E57C",
            "#96C8A9"
          ]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
          'Breakfast',
          'Lunch',
          'Coffee',
          'Dinner'
        ]
      },
      options: {
        legend: {
          labels: {
            fontSize: 20
          }
        }
      }
    });
  }

  duplicateTemplate(templateCounter, templateFunction) {
    const templates = [];
    for (var i = 0; i < Math.floor(templateCounter); i++) {
      templates.push(templateFunction(100));
    }
    templates.push(templateFunction(templateCounter * 100 % 100));
    return templates;
  }

  treeTemplate(percentageShown) {
    let customClass = '';
    if (percentageShown > 0 && percentageShown < 100) {
      customClass = 'p' + percentageShown;
    }
    return (
      <i class={`fas fa-tree icon ${customClass}`}></i>
    );
  }

  carTemplate(percentageShown) {
    let customClass = '';
    if (percentageShown > 0 && percentageShown < 100) {
      customClass = 'p' + percentageShown;
    }
    return (
      <i class={`fas fa-car icon ${customClass}`}></i>
    );
  }

  cowTemplate(percentageShown) {
    let customClass = '';
    if (percentageShown > 0 && percentageShown < 100) {
      customClass = 'p' + percentageShown;
    }
    return (
      <div class={`fas icon ${customClass}`} >
        <img class="icon" src="ressources/cow.svg" />
      </div>
    );
  }

  indicatorTemplate() {
    const currentDate = new Date();
    const currentGoal = this.weeklyGoal / 7 * (currentDate.getDay() || 7);
    if (this.state.current > this.weeklyGoal) {
      const indicatorPosition = 100 * this.weeklyGoal / (this.state.current * 1.66);
      return (
        <div class="uk-section uk-flex uk-flex-wrap background-gradient-30 indicator-container padding-all-mobile progress-bar-padding">
          <div class="indicator" style={{ left: indicatorPosition + '%' }} />
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap">
            <h1>Week</h1>
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center">
            <h2 class="uk-text-right">{this.state.current} / {this.weeklyGoal} kg CO2</h2>
          </div>
        </div>
      );
    } else if (this.state.current > currentGoal) {
      const indicatorPosition = 100 * currentGoal / this.weeklyGoal;
      const currentProgress = 100 * this.state.current / this.weeklyGoal;
      return (
        <div class="uk-section uk-flex uk-flex-wrap indicator-container padding-all-mobile progress-bar-padding" style={{
          background: '#F1E57C',
          background: `-moz-linear-gradient(45deg, #F1E57C ${currentProgress}%, #F2F2F2 ${currentProgress}%)`,
          background: `-webkit-linear-gradient(45deg, #F1E57C ${currentProgress}%, #F2F2F2 ${currentProgress}%)`,
          background: `linear-gradient(135deg, #F1E57C ${currentProgress}%, #F2F2F2 ${currentProgress}%)`
        }}>
          <div class="indicator" style={{ left: indicatorPosition + '%' }} />
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap">
            <h1>Week</h1>
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center">
            <h2 class="uk-text-right">{this.state.current} / {this.weeklyGoal} kg CO2</h2>
          </div>
        </div>
      )

    } else {
      const currentProgress = 100 * this.state.current / this.weeklyGoal;
      return (
        <div class="uk-section uk-flex uk-flex-wrap indicator-container padding-all-mobile progress-bar-padding" style={{
          background: '#96C8A9',
          background: `-moz-linear-gradient(45deg, #96C8A9 ${currentProgress}%, #F2F2F2 ${currentProgress}%)`,
          background: `-webkit-linear-gradient(45deg, #96C8A9 ${currentProgress}%, #F2F2F2 ${currentProgress}%)`,
          background: `linear-gradient(135deg, #96C8A9 ${currentProgress}%, #F2F2F2 ${currentProgress}%)`
        }}>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap">
            <h1>Week</h1>
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center">
            <h4 class="uk-text-right">{this.state.current} / {this.weeklyGoal} kg CO2</h4>
          </div>
        </div>
      )

    }
  }



  render() {
    return (
      <main id="statistics">
        {this.indicatorTemplate()}

        <div class="uk-section uk-section-muted uk-padding-remove">
          <div class="uk-container uk-margin-top uk-margin-bottom">
            <h1 class="uk-text-center">This is equivalent to:</h1>
          </div>
        </div>

        <div class="uk-section uk-section-default uk-flex uk-flex-wrap uk-flex-column padding-all-mobile uk-hidden@m">
          <h1 class="uk-text-center uk-margin-medium-bottom">{this.state.number_cars} miles driven in a car.</h1>
          <div class="uk-flex uk-flex-middle uk-flex-center uk-flex-wrap">
            {this.state.cars}
          </div>
        </div>

        <div class="uk-section uk-flex uk-flex-wrap background-gradient-reversed uk-visible@m">
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap padding-all">
            {this.state.cars}
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center padding-all">
            <h1>{this.state.number_cars} miles driven in a car.</h1>
          </div>
        </div>

        <div class="uk-section uk-section-muted uk-flex uk-flex-wrap uk-flex-column padding-all-mobile uk-hidden@m">
          <h1 class="uk-text-center uk-margin-medium-bottom">The weekly absorption by {this.state.number_trees} trees.</h1>
          <div class="uk-flex uk-flex-middle uk-flex-center uk-flex-wrap">
            {this.state.trees}
          </div>
        </div>

        <div class="uk-section uk-flex uk-flex-wrap background-gradient uk-visible@m">
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center padding-all">
            <h1>The weekly absorption <br /> by {this.state.number_trees} trees.</h1>
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap padding-all">
            {this.state.trees}
          </div>
        </div>

        <div class="uk-section uk-section-default uk-flex uk-flex-wrap uk-flex-column padding-all-mobile uk-hidden@m">
          <h1 class="uk-text-center uk-margin-medium-bottom">Emissions of {this.state.number_cows} cows in a day.</h1>
          <div class="uk-flex uk-flex-middle uk-flex-center uk-flex-wrap">
            {this.state.cows}
          </div>
        </div>

        <div class="uk-section uk-flex uk-flex-wrap background-gradient-reversed uk-visible@m">
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap padding-all">
            {this.state.cows}
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center padding-all">
            <h1>Emissions of {this.state.number_cows} <br /> cows in a day.</h1>
          </div>
        </div>

        <div class="uk-section uk-section-muted">
          <div class="uk-container uk-margin-large-top uk-margin-large-bottom">
            <h1 class="uk-text-center">Übersicht der Mahlzeiten</h1>
          </div>
        </div>
        <div class="uk-section uk-section">
          <div class="uk-container uk-flex uk-flex-center">
            <div class="width-limitiation">
              <canvas id="myChart" width="600px" height="600px"></canvas>
            </div>
          </div>
        </div>

      </main>
    );
  }
}

export default Statistics;
