import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PosNegDistribution from './PosNegDistribution';

class PosNegDistributionChart extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();

    this.createChart = this.createChart.bind(this);
  }

  getInitialState() {
    return {
      chart: null
    };
  }

  componentDidMount() {
    this.createChart();
    window.addEventListener('resize', this.createChart);
  }

  componentDidUpdate(nextProps) {
    const { chart } = this.state;
    const { data, comparisonData, cumulative } = this.props;
    if (chart && (
      JSON.stringify(nextProps.data) !== JSON.stringify(data) ||
      JSON.stringify(nextProps.comparisonData) !== JSON.stringify(comparisonData) ||
      cumulative !== nextProps.cumulative)) {
      chart.update(this.props);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.createChart);
  }

  createChart() {
    const el = ReactDOM.findDOMNode(this.refs.chart);
    const { chart } = this.state
    if (chart) {
      chart.destroy()
    }

    const margin = {
      top: 10,
      right: 10,
      bottom: 40,
      left: 50,
    };
    const { width } = this.props
    const elWidth = width || el.offsetWidth

    const props = {
      margin,
      width: elWidth - margin.left - margin.right,
      height: 350,
    };

    this.setState(
      {
        chart: new PosNegDistribution(el, props),
      },
      function callback() {
        this.state.chart.create();
        this.state.chart.update(this.props);
        this.state.chart.preventTransitions();
      }
    );
  }

  render() {
    return (
      <div
        ref='chart'
      />
    );
  }
}

export default PosNegDistributionChart