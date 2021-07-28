import * as d3 from 'd3';
import Chart from '../chart';

function getTextWidth(text, font) {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width > 100 ? metrics.width : 100;
}

const TEST_PERIOD = Object.freeze({
	"01": "Janeiro",
	"02": "Fevereiro",
	"03": "Março",
	"04": "Abril",
	"05": "Maio",
	"06": "Junho",
	"07": "Julho",
	"08": "Augusto",
	"09": "Setembro",
	"10": "Outubro",
	"11": "Novembro",
	"12": "Dezembro"
})

export default class APICall extends Chart {

  create() {
    this.svg = super.createRoot();

    this.yAxis = this.svg
      .append("g")
      .attr("class", "axis yAxis");

    this.xAxis = this.svg
      .append("g")
      .attr("class", "axis xAxis");

    this.areas = this.svg.append('g')
      .attr('class', 'areas')
  }

  update(state) {
    if (state) {
      this.drawCurve(state);
    }
  }

  translate(value) {
    return `${TEST_PERIOD[value.slice(5)]} de ${value.slice(0, 4)}`
  }

  drawCurve(state) {
    const { margin } = this.props;
    const data = state.data;
    const biggerText = Math.max(...state.data.map(v => getTextWidth(v.date, '11px')));
    const maxRequest = (parseInt(Math.max(...data.map(v => v.count)) / 10, 10) + 1) * 10;
    const div = d3.select("body").append("div").attr("class", "tooltip-chart");

    const groups = d3.map(data, (d) => d.fullDate).keys();
    const nameTicks = {}
    for (var i = 0; i < data.length; ++i) {
      nameTicks[data[i].fullDate] = data[i].date;
    }

    this.height = this.props.height - biggerText;
    this.width = this.props.width;

    const x = d3.scaleBand()
      .rangeRound([0, this.width + margin.left / 2])
      .domain(groups)
    const xAreas = x.bandwidth() / 2 + x(data[0].fullDate);

    const xPeriod = d3.scaleBand()
      .range([0, this.width + margin.left / 2])
      .domain(d3.range(data.length))
      .rangeRound([0, this.width + margin.left / 2]);

    const yScale = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, maxRequest || 10]);

    const areaFill = d3.area()
      .curve(d3.curveCardinal.tension(.65))
      .x((d, index) => { return xPeriod(index); })
      .y((d) => { return yScale(d.count); })
      .y1(yScale(0))
    const lineStroke = d3.line()
      .curve(d3.curveCardinal.tension(.65))
      .x((d, index) => { return xPeriod(index); })
      .y((d) => { return yScale(d.count); })

    const dataSeries = [
      {
        color: 'dodgerblue',
        strokeWidth: 2,
        data,
      }
    ];

    const xAxis = this.xAxis
      .selectAll('.xAxis')
      .data([null])
    xAxis.enter()
      .append('g')
      .attr('class', 'xAxis')
      .merge(xAxis)
      .call(d3.axisBottom(x).tickFormat(d => nameTicks[d]))
      .attr("transform", `translate(0, ${this.height})`)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    this.xAxis
      .selectAll('.periods')
      .data([null])
      .enter()
      .append('g')
      .attr('class', 'periods')
      .attr('transform', `translate(0,${this.props.height})`)
      .append('text')
      .attr('class', 'xAxisLabel')
      .attr('fill', '#b6b6b6')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${this.width / 2}, 15)`)
      .text("Periodo");

    const yAxis = this.yAxis
      .selectAll('.yAxis')
      .data([null])
    yAxis.enter()
      .append('g')
      .attr('class', 'yAxis')
      .merge(yAxis)
      .call(
        d3.axisLeft(yScale)
          .ticks(5, "f")
          .tickPadding(5)
          .tickSize(-this.props.width)
      )
    this.yAxis
      .selectAll('.requests')
      .data([null])
      .enter()
      .append('g')
      .attr('class', 'requests')
      .append('text')
      .attr('class', 'yRightAxisLabel')
      .attr('fill', '#b6b6b6')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(-40, ${this.props.height / 2}) rotate(-90)`)
      .text("Request");

    this.areas
      .attr("transform", `translate(${xAreas},0)`);

    const areaCurve = this.areas
      .selectAll('.areaCurve')
      .data(dataSeries);
    const areaCurveEnter = areaCurve.enter()
      .append('path')
      .attr('class', 'areaCurve');
    areaCurveEnter.merge(areaCurve)
      .attr('fill', d => d.color)
      .attr('opacity', 0.05)
      .attr("d", d => areaFill(d.data));

    const lineCurve = this.areas
      .selectAll('.lineCurve')
      .data(dataSeries);
    const lineCurveEnter = lineCurve.enter()
      .append('path')
      .attr('class', 'lineCurve');
    lineCurveEnter.merge(lineCurve)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => d.strokeWidth)
      .attr("d", d => lineStroke(d.data));

    const dots = this.areas
      .selectAll('circle')
      .data(data);
    dots.exit()
      .remove();
    const dotsEnter = dots.enter()
      .append('circle')
      .attr('class', 'dots');
    dotsEnter.merge(dots)
      .attr("fill", "#1e90ff")
      .attr("r", 4)
      .attr("cx", (d, index) => { return xPeriod(index); })
      .attr("cy", (d) => { return yScale(d.count); })
      .on("mouseover", (d) => {
        div.style("left", `${d3.event.pageX}px`)
          .style("top", `${d3.event.pageY}px`)
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        div.html(`Request: ${d.count}<br />
        Request: ${d.fullDate}
        `);
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });
  }

}