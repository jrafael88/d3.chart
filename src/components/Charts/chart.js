import { select, timerFlush } from "d3";

export default class Chart {
  constructor(el, props) {
    this.el = el;
    this.props = props;
  }

  create() {}

  createRoot() {
    const { width, height, margin } = this.props;

    const svg = select(this.el)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("y-heading", "members")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    return svg;
  }

  update() {}

  preventTransitions() {
    const now = Date.now;
    Date.now = () => Infinity;
    timerFlush();
    Date.now = now;
  }

  destroy() {
    select(this.el).selectAll("svg").remove();
  }

  per(amount) {
    return (15 * amount) / 100;
  }

}
