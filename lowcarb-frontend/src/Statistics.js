import React, { Component } from 'react';
import UIkit from 'uikit';
import Chart from 'chart.js';
import './Statistics.css'

class Statistics extends Component {

  constructor() {
    super();

    this.weeklyGoal = 500;
    this.current = 300;

    this.number_trees = 6.8;
    this.trees = this.duplicateTemplate(this.number_trees, this.treeTemplate);

    this.number_cars = 10.8;
    this.cars = this.duplicateTemplate(this.number_cars, this.carTemplate);

    this.number_cows = 11.4;
    this.cows = this.duplicateTemplate(this.number_cows, this.cowTemplate);

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
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
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
    if (this.current > this.weeklyGoal) {
      const indicatorPosition = 100 * this.weeklyGoal / (this.current * 1.66);
      return(
        <div class="uk-section uk-flex uk-flex-wrap background-gradient-30 indicator-container">
          <div class="indicator" style={{left: indicatorPosition + '%'}} />
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap">
            <h1>Current Week</h1>
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center">
            <h2 class="uk-text-right">{this.current} / {this.weeklyGoal} Kilos CO2 produced</h2>
          </div>
        </div>
      );
    } else if (this.current > currentGoal) {
      const indicatorPosition = 100 * currentGoal / this.weeklyGoal;
      const currentProgress = 100 * this.current / this.weeklyGoal;
      return (
        <div class="uk-section uk-flex uk-flex-wrap indicator-container" style={{
          background: '#F1E57C',
          background: `-moz-linear-gradient(45deg, #F1E57C ${currentProgress}%, #F2F2F2 ${currentProgress}%)`,
          background: `-webkit-linear-gradient(45deg, #F1E57C ${currentProgress}%, #F2F2F2 ${currentProgress}%)`,
          background: `linear-gradient(135deg, #F1E57C ${currentProgress}%, #F2F2F2 ${currentProgress}%)`
        }}>
          <div class="indicator" style={{left: indicatorPosition + '%'}} />
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap">
            <h1>Current Week</h1>
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center">
            <h2 class="uk-text-right">{this.current} / {this.weeklyGoal} Kilos CO2 produced</h2>
          </div>
        </div>
      )

    } else {
      const currentProgress = 100 * this.current / this.weeklyGoal;
      return (
        <div class="uk-section uk-flex uk-flex-wrap indicator-container" style={{
          background: '#96C8A9',
          background: `-moz-linear-gradient(45deg, #96C8A9 ${currentProgress}%, #F2F2F2 ${currentProgress}%)`,
          background: `-webkit-linear-gradient(45deg, #96C8A9 ${currentProgress}%, #F2F2F2 ${currentProgress}%)`,
          background: `linear-gradient(135deg, #96C8A9 ${currentProgress}%, #F2F2F2 ${currentProgress}%)`
        }}>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap">
            <h1>Current Week</h1>
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center">
            <h2 class="uk-text-right">{this.current} / {this.weeklyGoal} Kilos CO2 produced</h2>
          </div>
        </div>
      )

    }
  }



  render() {
    return (
      <main id="statistics">
        {this.indicatorTemplate()}


        <div class="uk-section uk-flex uk-flex-wrap background-gradient-reversed">
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap padding-all">
            {this.trees}
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center padding-all">
            <h1>1,8 Baumleben</h1>
          </div>

        </div>

        <div class="uk-section uk-flex uk-flex-wrap background-gradient">
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center padding-all">
            <h1>340km Autofahren</h1>
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap padding-all">
            {this.cars}
          </div>
        </div>

        <div class="uk-section uk-flex uk-flex-wrap background-gradient-reversed">
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center uk-flex-wrap padding-all">
            {this.cows}
          </div>
          <div class="uk-width-1-2 uk-flex uk-flex-middle uk-flex-center padding-all">
            <h1>{this.number_cows} Kühen</h1>
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
