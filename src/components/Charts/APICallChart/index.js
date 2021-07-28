import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import APICall from "./APICall";

class APICallChart extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();

    this.createChart = this.createChart.bind(this);
  }

  getInitialState() {
    return {
      chart: null,
    };
  }

  componentDidMount() {
    this.createChart();
    window.addEventListener('resize', this.createChart);
  }

  componentDidUpdate(nextProps) {
    const { chart } = this.state;
    const { data, cumulative } = this.props;
    if (chart && (JSON.stringify(nextProps.data) !== JSON.stringify(data) || cumulative !== nextProps.cumulative)) {
      chart.update(nextProps);
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
      top: 20,
      right: 30,
      bottom: 20,
      left: 50,
    };
    const { width } = this.props
    const elWidth = width || el.offsetWidth

    const props = {
      margin,
      width: elWidth - margin.left - margin.right,
      height: 260,
    };
        
    // Initialise the chart, then render it without transitions.
    this.setState({
      chart: new APICall(el, props),
    }, function callback() {
      this.state.chart.create();
      this.state.chart.update(this.props);
    });
  }

  render() {
    return (
      <div id='APICallChart' ref='chart'></div>
    );
  }
}

export default APICallChart