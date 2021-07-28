import * as d3 from 'd3';
import Chart from '../chart';

export default class ROC extends Chart {
  create(state) {
    this.svg = super.createRoot();
    this.main = this.svg.append('g')
      .attr('class', 'main');

    this.pin = this.svg.append('g')
      .attr('class', 'pin');

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
      .text("Sensitivity (True Positive Rate = TP / P)");

    this.xAxis.append('text')
      .attr('class', 'xAxisLabel')
      .attr('fill', '#b6b6b6')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${this.props.width / 2}, 35)`)
      .text("1 - Specificity (False Positive Rate = FP / N)");

    !state.comparisonData && this.drawPin()
  }

  update(state) {
    const { colors, comparisonData, data, modelData } = state

    if (comparisonData) {
      this.drawChart({ ...state, data: comparisonData.data1, color: colors[0], className: 'roc1' })
      this.drawChart({ ...state, data: comparisonData.data2, color: colors[1], className: 'roc2' })
      this.drawChart({ ...state, data: comparisonData.data3, color: colors[2], className: 'roc3' })
    } else {
      this.id = state.id;
      this.state = state;
      this.onTimeChange = state.onTimeChange;
      this.onThresholdChange = state.onThresholdChange;

      this.drawChart({ ...state, data: modelData, color: 'lightgrey', className: 'roc2' })
      this.drawChart({ ...state, data: data, color: 'dodgerblue', className: 'roc1' })

      this.updateThreshold(state)
    }
  }

  updateThreshold(state) {
    this.state = state;
    const pos = state.data
      .sort((a, b) => b.threshold - a.threshold)
      .find(d => d.threshold <= state.threshold)

    if (this.pin && pos && state.precision) {
      this.pin.select('circle')
        .attr('cx', this.falsePositiveRatio(pos.falsePositiveRatio))
        .attr('cy', this.truePositiveRatio(pos.truePositiveRatio))
    }
  }

  drawChart(state) {
    const data = (state.data || [])
      .map(d => ({ ...d, falsePositiveRatio: d.falsePositiveRatio === undefined ? d.x : d.falsePositiveRatio, truePositiveRatio: d.truePositiveRatio === undefined ? d.y : d.truePositiveRatio }))

    const fpr = d3.scaleLinear()
      .range([0, this.props.width])
      .domain([0, 1])
    this.falsePositiveRatio = fpr;

    const tpr = d3.scaleLinear()
      .range([this.props.height, 0])
      .domain([0, 1])
    this.truePositiveRatio = tpr;

    const threshold = d3.scaleLinear()
      .range([this.props.height, 0])
      .domain([0, 1])
    this.y = threshold;

    this.area = (accessor, yScale) => d3.area()
      .curve(d3.curveMonotoneX)
      .x(d => fpr(d.falsePositiveRatio))
      .y0(d => yScale(d[accessor]))
      .y1(yScale(0))

    this.line = (accessor, yScale) => d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => fpr(d.falsePositiveRatio))
      .y(d => yScale(d[accessor]))

    const xAxis = d3
      .axisBottom(fpr)

    const yLeftAxis = d3
      .axisLeft(tpr)
      .ticks(10)

    const dataSeries = [{
      name: 'training',
      color: state.color,
      accessor: 'truePositiveRatio',
      area: true,
      scale: tpr,
      data,
    }]

    if (!state.comparisonData) {
      dataSeries.push(
        {
          name: 'threshold',
          color: 'lightgrey',
          strokeWidth: 0.5,
          accessor: 'threshold',
          scale: threshold,
          data,
        },
        {
          name: 'random',
          color: 'grey',
          dashed: true,
          accessor: 'truePositiveRatio',
          scale: tpr,
          data: [{ truePositiveRatio: 0, falsePositiveRatio: 0 }, { truePositiveRatio: 1, falsePositiveRatio: 1 }],
        }
      )
    }

    const areaCurve = this.areas
      .selectAll(`.${state.className}AreaCurve`)
      .data(dataSeries.filter(d => d.area))
    const areaCurveEnter = areaCurve.enter()
      .append('path')
      .attr('class', `${state.className}AreaCurve`)
    areaCurveEnter.merge(areaCurve)
      .transition()
      .attr('fill', d => d.color)
      .attr('opacity', 0.05)
      .attr('d', d => this.area(d.accessor, d.scale)(d.data))

    const lineCurveRoc = this.areas
      .selectAll(`.${state.className}LineCurveRoc`)
      .data(dataSeries.filter(d => d.area))
    this.lineCurveRocEnter = lineCurveRoc.enter()
      .append('path')
      .attr('class', `${state.className}LineCurveRoc`)
    this.lineCurveRocEnter.merge(lineCurveRoc)
      .transition()
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => d.strokeWidth ? d.strokeWisth : 2)
      .attr('stroke-dasharray', d => d.dashed ? '5' : '')
      .attr('d', d => this.line(d.accessor, d.scale)(d.data))

    if (!state.comparisonData) {
      const lineCurve = this.areas
        .selectAll('.lineCurve')
        .data(dataSeries)
      const lineCurveEnter = lineCurve.enter()
        .append('path')
        .attr('class', 'lineCurve')
      lineCurveEnter.merge(lineCurve)
        .transition()
        .attr('fill', 'none')
        .attr('stroke', d => d.color)
        .attr('stroke-width', d => d.strokeWidth ? d.strokeWisth : 2)
        .attr('stroke-dasharray', d => d.dashed ? '5' : '')
        .attr('d', d => this.line(d.accessor, d.scale)(d.data))
    }

    this.svg.select('.xROCAxis')
      .call(xAxis)
    this.svg.select('.yROCAxis')
      .call(yLeftAxis)
  }

  drawPin() {
    this.pin.append('circle')
      .attr('r', 8)
      .attr('fill', 'white')
      .attr('stroke', 'dodgerblue')
      .attr('stroke-width', 3)
      .attr('cx', 0)
      .attr('cy', this.props.height)
      .call(d3.drag()
        .on('start', (d) => { this.dragStarted() })
        .on('drag', (d) => { this.dragged() })
        .on('end', (d) => { this.dragEnded() })
      )
      .on('mouseover', function (d) {
        d3.select(this).style('cursor', 'ew-resize')
      })
  }

  dragged = (d) => {
    const m = d3.mouse(this.svg.node());
    const p = this.closestPoint(d3.select(`#${this.id} path.roc1LineCurveRoc`).node(), m);
    this.pin.select('circle')
      .attr('cx', p.falsePositiveRatio)
      .attr('cy', p.truePositiveRatio)

    const falsePositiveRatio = this.falsePositiveRatio.invert(Math.max(0, Math.min(d3.event.x, this.props.width)));
    const truePositiveRatio = this.truePositiveRatio.invert(Math.max(0, Math.min(d3.event.y, this.props.height)));

    const pos = this.state.data
      .sort((a, b) => b.falsePositiveRatio - a.falsePositiveRatio || b.truePositiveRatio - a.truePositiveRatio)
      .find(d => d.falsePositiveRatio <= falsePositiveRatio && d.truePositiveRatio <= truePositiveRatio)

    if (this.onThresholdChange) this.onThresholdChange(pos.threshold);
  }

  dragStarted() {
    this.pin.select('circle')
      .attr('fill', 'dodgerblue');
  }

  dragEnded() {
    this.pin.select('circle')
      .attr('fill', 'white');
  }

  closestPoint(pathNode, point) {
    const pathLength = pathNode.getTotalLength();
    const precisionLinear = 8;
    let position;
    let positionLength;
    let positionDistance = Infinity;

    for (let scanLength = 0; scanLength <= pathLength; scanLength += precisionLinear) {
      const scan = pathNode.getPointAtLength(scanLength)
      const scanDistance = this.distance2(scan, point);
      if (scanDistance < positionDistance) {
        position = scan;
        positionLength = scanLength;
        positionDistance = scanDistance;
      }
    }

    let precisionEstimate = 4;
    while (precisionEstimate > .5) {
      const beforeLength = positionLength - precisionEstimate;
      const before = pathNode.getPointAtLength(beforeLength);
      const beforeDistance = this.distance2(before, point)
      const afterLength = positionLength + precisionEstimate;
      const after = pathNode.getPointAtLength(afterLength)
      const afterDistance = this.distance2(after, point);

      if ((beforeLength) >= 0 && beforeDistance < positionDistance) {
        position = before
        positionLength = beforeLength
        positionDistance = beforeDistance;
      } else if ((afterLength) <= pathLength && afterDistance < positionDistance) {
        position = after
        positionLength = afterLength
        positionDistance = afterDistance;
      } else {
        precisionEstimate /= 2;
      }
    }

    return { falsePositiveRatio: position.x, truePositiveRatio: position.y };
  }

  distance2 = (p, point) => {
    const dx = p.x - point[0]
    const dy = p.y - point[1];
    return dx * dx + dy * dy;
  }
}