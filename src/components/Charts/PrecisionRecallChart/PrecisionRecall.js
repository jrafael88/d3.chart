import * as d3 from 'd3';

import Chart from '../chart';

export default class PrecisionRecall extends Chart {
  create(state) {
    this.svg = super.createRoot();
    this.main = this.svg.append('g')
      .attr('class', 'main');

    this.areas = this.main.append('g')
      .attr('class', 'areas')
      .attr('id', state.id)

    this.xAxis = this.main.append('g')
      .attr('class', 'xROCAxis')
      .attr('transform', `translate(0,${this.props.height})`)

    this.yLeftAxis = this.main.append('g')
      .attr('class', 'yROCAxis')

    this.yLeftAxis.append('text')
      .attr('class', 'yLeftAxisLabel')
      .attr('fill', '#b6b6b6')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(-40, ${this.props.height / 2}) rotate(-90)`)
      .text("Precision");

    this.xAxis.append('text')
      .attr('class', 'xAxisLabel')
      .attr('fill', '#b6b6b6')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${this.props.width / 2}, 35)`)
      .text("Recall");
  }

  update(state) {
    const { colors, comparisonData, data, modelData } = state
    if (comparisonData) {
      this.drawChart({ ...state, data: comparisonData.data1, className: 'precision1', color: colors[0] })
      this.drawChart({ ...state, data: comparisonData.data2, className: 'precision2', color: colors[1] })
      this.drawChart({ ...state, data: comparisonData.data3, className: 'precision3', color: colors[2] })
    } else {
      this.drawChart({ ...state, data: modelData || [], className: 'precision2', color: 'lightgrey' })
      this.drawChart({ ...state, data: data, className: 'precision1', color: '#393486' })
    }
  }

  drawChart(state) {
    const { data, className, color } = state

    const recall = d3.scaleLinear()
      .range([0, this.props.width])
      .domain([0, 1])

    const precision = d3.scaleLinear()
      .range([this.props.height, 0])
      .domain([0, 1])

    this.area = (accessor, yScale) => d3.area()
      .curve(d3.curveMonotoneX)
      .x(d => recall(d.recall))
      .y0(d => yScale(d[accessor]))
      .y1(yScale(0))

    this.line = (accessor, yScale) => d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => recall(d.recall))
      .y(d => yScale(d[accessor]))

    const xAxis = d3
      .axisBottom(recall)

    const yLeftAxis = d3
      .axisLeft(precision)

    yLeftAxis
      .ticks(10)

    const dataSeries = [
      {
        name: 'training',
        color: color,
        accessor: 'precision',
        scale: precision,
        data,
      }
    ];

    const areaCurve = this.areas
      .selectAll(`.${className}AreaCurve`)
      .data(dataSeries)
    const areaCurveEnter = areaCurve.enter()
      .append('path')
      .attr('class', `${className}AreaCurve`)
    areaCurveEnter.merge(areaCurve)
      .transition()
      .duration(750)
      .attr('fill', d => d.color)
      .attr('opacity', 0.05)
      .attr('d', d => this.area(d.accessor, d.scale)(d.data))

    const lineCurveRoc = this.areas
      .selectAll(`.${className}LineCurveRoc`)
      .data(dataSeries)
    this.lineCurveRocEnter = lineCurveRoc
      .enter()
      .append('path')
      .attr('class', `${className}LineCurveRoc`)
    this.lineCurveRocEnter
      .merge(lineCurveRoc)
      .transition()
      .duration(750)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
      .attr('d', d => this.line(d.accessor, d.scale)(d.data))

    this.x = d3.scaleLinear()
      .rangeRound([0, this.props.width])
      .domain([0, 1]);

    this.y = d3.scaleLinear()
      .rangeRound([this.props.height, 0])
      .domain([0, 1]);

      this.areas.append("g")
      .attr('class', 'linha')
      .append("line")
      .style("stroke", "#2ecc71")
      .style("stroke-width", "2px")
      .attr('stroke-dasharray', 5)

      .attr('x1', this.x(0))
      .attr('x2', this.x(1))
      .attr('y1', this.props.height - 10)
      .attr('y2', this.props.height - 10)

    this.svg.select('.xROCAxis')
      .call(xAxis)
    this.svg.select('.yROCAxis')
      .call(yLeftAxis)
  }
}
