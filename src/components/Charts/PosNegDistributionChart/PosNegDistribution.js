import * as d3 from 'd3';
import _ from 'lodash'

import Chart from '../chart';

export default class PosNegDistributionChart extends Chart {

  create() {
    this.svg = super.createRoot();
    this.main = this.svg.append('g')
      .attr('class', 'main');

    this.areas = this.main.append('g')
      .attr('class', 'areas')

    this.xAxis = this.main.append('g')
      .attr('class', 'xPosNegDistributionAxis')
      .attr('transform', `translate(0,${this.props.height})`)

    this.yLeftAxis = this.main.append('g')
      .attr('class', 'yPosNegDistributionAxis')

    this.yLeftAxis.append('text')
      .attr('class', 'yLeftAxisLabel')
      .attr('fill', '#b6b6b6')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(-40, ${this.props.height / 2}) rotate(-90)`)
      .text("Cumulative Probability");

    this.ksScore = this.main.append('g')
      .attr('class', 'ksScore')

    this.shadowPath = this.main.append('g');
  }

  update(state) {
    const { comparisonData, cumulative, colors, data } = state
    if (comparisonData) {
      this.drawChart({ values: comparisonData.data1, cumulative: cumulative, className: 'one', color: { positive: colors[0], negative: colors[0] } })
      this.drawChart({ values: comparisonData.data2, cumulative: cumulative, className: 'second', color: { positive: colors[1], negative: colors[1] } })
      this.drawChart({ values: comparisonData.data3, cumulative: cumulative, className: 'third', color: { positive: colors[2], negative: colors[2] } })
    } else {
      this.onThresholdChange = state.onThresholdChange;
      this.drawChart({ values: data, cumulative: cumulative, className: 'one', color: { positive: '#87d068', negative: 'tomato' } })
      this.drawKSScore(state)
    }
  }

  updateThreshold(state) {
    this.pin.select('circle')
      .attr('cx', this.x(state.threshold))
  }

  drawChart(state) {
    const { values, cumulative, className, color } = state
    const data = (values || [])
      .map(d => ({ ...d, trueNegativeRatio: 1 - d.falsePositiveRatio, falseNegativeRatio: 1 - d.truePositiveRatio }))
      .sort((a, b) => a.threshold - b.threshold)

    const tempData = data.map((d, i) => ({ ...d, nProp: i === 0 ? d.trueNegativeRatio : d.trueNegativeRatio - data[i - 1].trueNegativeRatio, pProp: i === 0 ? d.falseNegativeRatio : d.falseNegativeRatio - data[i - 1].falseNegativeRatio }))
    const binNum = 20;
    const distributionData = [{ threshold: 0, trueNegativeRatio: 0, falseNegativeRatio: 0 }, ...Array(binNum).fill(1).map((_, i) => {
      return {
        threshold: (i + 1) / binNum,
        trueNegativeRatio: tempData.reduce((sum, d) => {
          return sum + (d.threshold >= i / binNum && d.threshold < (i + 1) / binNum ? d.nProp : 0)
        }, 0),
        falseNegativeRatio: tempData.reduce((sum, d) => {
          return sum + (d.threshold >= i / binNum && d.threshold < (i + 1) / binNum ? d.pProp : 0)
        }, 0),
      }
    })]

    const threshold = d3.scaleLinear()
      .range([0, this.props.width])
      .domain([0, 1])
    this.x = threshold;

    const proportion = d3.scaleLinear()
      .range([this.props.height, 0])
      .domain([0, 1])
    this.y = proportion;

    const area = (accessor, yScale) => d3.area()
      .curve(d3.curveMonotoneX)
      .x(d => threshold(d.threshold))
      .y0(d => yScale(d[accessor]))
      .y1(yScale(0))

    const line = (accessor, yScale) => d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => threshold(d.threshold))
      .y(d => yScale(d[accessor]))

    const tnrPath = this.getPathCoord(data, proportion, threshold, distributionData, line, 'trueNegativeRatio')
    const fnrPath = this.getPathCoord(data, proportion, threshold, distributionData, line, 'falseNegativeRatio')

    const xAxis = d3
      .axisBottom(threshold)

    const yLeftAxis = d3
      .axisLeft(proportion)

    yLeftAxis
      .ticks(10)

    var dataSeries
    if (cumulative) {
      dataSeries = [
        {
          name: 'positive',
          color: color.positive,
          accessor: 'falseNegativeRatio',
          scale: proportion,
          data,
        },
        {
          name: 'negative',
          color: color.negative,
          accessor: 'trueNegativeRatio',
          scale: proportion,
          data,
        },
      ]
    } else {
      const max = Math.max(...fnrPath.map(d => d.falseNegativeRatio), ...tnrPath.map(d => d.trueNegativeRatio))
      proportion.domain([0, max * 1.5])
      dataSeries = [
        {
          name: 'positive',
          color: color.positive,
          accessor: 'falseNegativeRatio',
          area: true,
          scale: proportion,
          data: fnrPath,
        },
        {
          name: 'negative',
          color: color.negative,
          accessor: 'trueNegativeRatio',
          area: true,
          scale: proportion,
          data: tnrPath,
        },
      ]
    }

    const areaCurve = this.areas
      .selectAll(`.${className}_areaCurve`)
      .data(dataSeries)

    const areaCurveEnter = areaCurve.enter()
      .append('path')
      .attr('class', `${className}_areaCurve`)

    areaCurveEnter.merge(areaCurve)
      .transition()
      .duration(750)
      .attr('fill', d => d.color)
      .attr('opacity', cumulative ? 0 : 0.05)
      .attr('d', d => area(d.accessor, d.scale)(d.data))

    const lineCurve = this.areas
      .selectAll(`.${className}_lineCurve`)
      .data(dataSeries)

    const lineCurveEnter = lineCurve.enter()
      .append('path')
      .attr('class', `${className}_lineCurve`)

    lineCurveEnter.merge(lineCurve)
      .transition()
      .duration(750)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.dashed ? '5' : '')
      .attr('d', d => line(d.accessor, d.scale)(d.data))

    this.svg.select(`.xPosNegDistributionAxis`)
      .call(xAxis)
    this.svg.select(`.yPosNegDistributionAxis`)
      .call(yLeftAxis)

    if (cumulative) {
      this.yLeftAxis
        .transition()
        .attr('opacity', 1)
    } else {
      this.yLeftAxis
        .transition()
        .attr('opacity', 0)
    }
  }

  getPathCoord = (data, proportion, threshold, distributionData, line, accessor) => {
    this.shadowPath.select('*').remove();
    const svgLine = line(accessor, proportion)(distributionData);
    this.shadowPath.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('d', svgLine)
    const path = this.shadowPath.select('path').node()
    const distance = path.getTotalLength()
    const accessorPath = Array(data.length).fill(1)
      .map((_, i) => i * distance / data.length)
      .map(dist => path.getPointAtLength(dist))
      .map(coord => ({ threshold: threshold.invert(coord.x), [accessor]: proportion.invert(coord.y) }))
    this.shadowPath.select('*').remove();
    return accessorPath;
  }

  drawPin() {
    var self = this;
    this.pin.append('circle')
      .attr('r', 8)
      .attr('fill', 'white')
      .attr('stroke', 'dodgerblue')
      .attr('stroke-width', 3)
      .attr('cx', this.props.width)
      .attr('cy', this.props.height)
      .call(d3.drag()
        .on('start', function (d) { self.dragStarted(this) })
        .on('drag', function (d) { self.dragged(this, self) })
        .on('end', function (d) { self.dragEnded(this) }))
      .on('mouseover', function (d) { d3.select(this).style('cursor', 'ew-resize') });
  }

  drawKSScore(state) {
    this.ksScore.selectAll('*')
      .transition()
      .duration(1000)
      .style('opacity', 0)
      .remove()
    if (state.data && state.cumulative) {
      const ksMark = _.maxBy(state.data, p => Math.abs(p.trueNegativeRatio - p.falseNegativeRatio))
      const score = Math.abs(ksMark.trueNegativeRatio - ksMark.falseNegativeRatio)
      const threshold = ksMark.threshold
      const tnr = ksMark.trueNegativeRatio
      const fnr = ksMark.falseNegativeRatio

      this.ksScore.append('line')
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .attr('stroke-dasharray', 3)
        .attr('x1', this.x(threshold))
        .attr('y1', this.y((tnr + fnr) / 2))
        .attr('x2', this.x(threshold))
        .attr('y2', this.y((tnr + fnr) / 2))
        .transition()
        .delay(500)
        .duration(1000)
        .attr('x1', this.x(threshold))
        .attr('y1', this.y(tnr))
        .attr('x2', this.x(threshold))
        .attr('y2', this.y(fnr))

      this.ksScore.append('text')
        .attr('class', 'ksScoreLabel')
        .attr('fill', 'black')
        .attr('x', this.x(threshold) + 10)
        .attr('y', this.y((tnr + fnr) / 2))
        .attr('text-anchor', 'start')
        .style('opacity', 0)
        .text(`Max KS: ${score}`)
        .transition()
        .delay(500)
        .duration(1000)
        .style('opacity', 1)
    }
  }

  dragStarted(element) {
    d3.select(element)
      .attr('fill', 'dodgerblue');
  }

  dragged(element, self) {
    const pos = Math.max(0, Math.min(d3.event.x, self.props.width))
    this.pin.select('circle')
      .attr('cx', pos);

    const x = self.x.invert(pos);
    if (self.onThresholdChange) self.onThresholdChange(x);
  }

  dragEnded(element) {
    d3.select(element)
      .attr('fill', 'white');
  }
}