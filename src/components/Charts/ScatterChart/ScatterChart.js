import * as d3 from 'd3';
// import numeral from 'numeral'

// import i18n from '../../../../i18n'
import Chart from '../chart';
// import './ScatterChart.css'

export default class ScatterBasicChart extends Chart {

  create() {
    this.svg = super.createRoot()
  }

  update(state) {
    if (state) {
      this.createSetup(state)
      this.createTooltip()
      this.drawBottom()
      this.drawDot(state)
      this.drawLine(state)
    }
  }

  createSetup(state) {
    const { data } = state
    this.width = this.props.width + 10
    this.height = this.props.height - 50
    const minX = Math.min(...data.map(v => v.shap))
    const maxX = Math.max(...data.map(v => v.shap))
    this.minX = Math.sign(minX) === 1 ? minX - this.per(minX) : minX + this.per(minX)
    this.maxX = maxX + this.per(maxX)

    const minY = Math.min(...data.map(v => v.value))
    const maxY = Math.max(...data.map(v => v.value))
    this.minY = Math.sign(minY) === 1 ? minY - this.per(minY) : minY + this.per(minY)
    this.maxY = maxY + this.per(maxY)

    this.x = d3.scaleLinear()
      .domain([this.minX, this.maxX])
      .range([0, this.width])

    this.y = d3.scaleLinear()
      .domain([this.minY, this.maxY])
      .range([this.height - 10, 0])
  }

  createTooltip() {
    this.tooltip = d3.select("#scatterChart")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip-chart")
  }

  drawDot(state) {
    const colors = d3.scaleLinear()
      .domain([this.minY, this.maxY])
      .range(["#1890ff", "#eb3423"])

    this.svg.append('g')
      .attr('class', 'dots')
      .selectAll("dot")
      .data(state.data)
      .enter()
      .append("circle")
      .attr("cx", (d) => this.x(d.shap))
      .attr("cy", (d) => this.y(d.value))
      .attr("r", 2.5)
      .attr("fill", (d, i) => colors(d.value))
      .on("mouseover", (d) => {
        const offsetX = d3.event.offsetX > this.props.width ?
          d3.event.offsetX - document.querySelector('#scatterChart .tooltip-chart').clientWidth :
          d3.event.offsetX
        this.tooltip
          .html(`Shap Value: ${d.shap}`)
          .style("left", `${offsetX}px`)
          .style("top", `${d3.event.offsetY}px`)
          .transition()
          .duration(200)
          .style("opacity", 0.9)
      })
      .on("mouseout", (d) => {
        this.tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      })
  }

  drawLine(state) {
    const lines = this.svg
      .attr("class", "lines")
      .append("g")

    const color = d3
      .scaleLinear()
      .range(['#eb3423', '#1890ff'])
      .domain([1, 2]);
    const linearGradient = lines
      .append("defs")
      .append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("gradientTransform", "rotate(90)");
    linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color(1));
    linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color(2));

    lines.append("rect")
      .attr("x", -5)
      .attr("y", 0)
      .attr("width", 5)
      .attr("height", this.height + 1)
      .style("fill", "url(#linear-gradient)");


    const yAxis = lines
      .append("g")
      .attr("class", "axis")
    yAxis.append('g')
      .attr('class', 'variableName')
      .append('text')
      .attr('class', 'yLeftAxisLabel')
      .attr('fill', '#b6b6b6')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(-60, ${this.props.height / 2}) rotate(-90)`)
      .text(state.variable)
    yAxis.append('g')
      .attr('class', 'variableName')
      .append('text')
      .attr('class', 'yLeftAxisLabel')
      .attr('fill', '#b6b6b6')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(-25, 10)`)
      .text("high")
    yAxis.append('g')
      .attr('class', 'variableName')
      .append('text')
      .attr('class', 'yLeftAxisLabel')
      .attr('fill', '#b6b6b6')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(-25, ${this.height})`)
      .text("low")

    lines
      .attr("class", "line")
      .append("g")
      .append('line')
      .style('stroke', '#7297be')
      .style('stroke-width', 2)
      .style('stroke-dasharray', 5)
      .attr('x1', 10)
      .attr('y1', this.props.height - 60)
      .attr('x2', this.width + 10)
      .attr('y2', this.props.height - 60)
  }

  drawBottom() {
    const xAxis = this.svg
      .append("g")
      .attr("class", "axis");

    xAxis
      .attr("transform", `translate(10, ${this.height})`)
      .append("g")
      .attr("class", "xAxis")
      .call(d3.axisBottom(this.x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    xAxis.append('g')
      .attr('class', 'approvalRate')
      .append('text')
      .attr('fill', '#b6b6b6')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${this.width / 2}, ${45 + this.props.margin.bottom})`)
      .text("Shap Value")
  }

}