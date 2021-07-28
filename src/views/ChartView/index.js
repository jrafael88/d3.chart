import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";

import { useManualRequest } from "../../hooks/useFetch";
import { getBuildsCount } from "../../constants/builds";
import Card from "../../components/Card";
import { APICallChart, PosNegDistributionChart, ROCChart, ScatterChart } from "../../components/Charts";

const groupBy = (timeWindow, dates) => {
  // const { t } = this.props;
  // const { timeWindow } = this.state;
  let response = {};
  const totalDate = dates.length;
  for (let i = 0; i < totalDate; i++) {
    const data = dates[i];
    const date = moment(data.date);
    const dateFormat = date.format("YYYY-MM-DD");
    const objDate = {
      day: date.format("DD"),
      month: date.format("MM"),
      year: date.format("YYYY"),
      hours: date.format("HH"),
      minutes: date.format("mm"),
    };

    if (timeWindow === "17days" && !response[dateFormat]) {
      response[dateFormat] = {
        ...data,
        fullDate: `${objDate.day}/${objDate.month}/${objDate.year}`,
        // "date": "{{year}}/{{month}}/{{day}}",
        // t(`date.date`, objDate),
        date: `${objDate.day}/${objDate.month}/${objDate.year}`,
      };
    } else if (timeWindow === "17days") {
      response[dateFormat].count = response[dateFormat].count + data.count;
    } else {
      response[date] = {
        ...data,
        fullDate: `${objDate.day}/${objDate.month}/${objDate.year} at ${objDate.hours}h ${objDate.minutes}`,
        // "dateAtTimeIndicator": "{{year}}/{{month}}/{{day}} at {{hours}}h{{minutes}}",
        // t(`date.dateAtTimeIndicator`, objDate),
        date: `${objDate.hours}h ${objDate.minutes}`,
        // "time": "{{hours}}h{{minutes}}",
        // t(`date.time`, objDate)
      };
    }
  }
  return Object.values(response);
};

const ChartView = () => {
  const [makeCharts, responseCharts] = useManualRequest(getBuildsCount);

  const [charts, setCharts] = useState();

  const [cumulative, setCumulative] = useState(true);
  const [precisionButton, setPrecisionButton] = useState("maxF1");
  const [threshold, setThreshold] = useState(null);
  const [training, setTraining] = useState(null);

  useEffect(() => {
    if (responseCharts) {
      const training = responseCharts.qualitySets;
      const rocCurveData = training.curve;
      const maxF1 = _.maxBy(rocCurveData, (d) => d.f1).threshold;
      const maxAccuracy = _.maxBy(rocCurveData, (d) => d.accuracy).threshold;
      const maxKs = _.maxBy(rocCurveData, (p) =>
        Math.abs(p.trueNegativeRatio - p.falseNegativeRatio)
      ).threshold;
      const presetThresholds = { maxF1, maxAccuracy, maxKs };

      setThreshold(presetThresholds["maxF1"]);
      setCharts(responseCharts);
      setTraining(training);
    }
  }, [responseCharts]);

  useEffect(() => {
    makeCharts("25/01/2020");
  }, []);

  const onThresholdReceive = (threshold) => {
    setThreshold(threshold);
    setPrecisionButton(null);
  };

  return (
    <div data-testid="dashboarView">
      {charts && (
        <>
          <section className="row">
            <section className="col col-24">
              <Card title={"Grafico de periodo"}>
                <APICallChart data={groupBy("7days", charts.timeValues)} />
              </Card>
            </section>

            <section className="col col-24">
              <Card title={"ScatterPlot"}>
                <ScatterChart data={charts.shap_chart} variable={"regiao"} />
              </Card>
            </section>
          </section>

          <section className="row">
            <section className="col col-12">
              <Card title={"Ks Score"}>
                <PosNegDistributionChart
                  data={training.curve}
                  threshold={threshold}
                  cumulative={cumulative}
                />
              </Card>
            </section>

            <section className="col col-12">
              <Card title={"ROC"}>
                <ROCChart
                  id="rocChart"
                  data={training.curve}
                  threshold={threshold}
                  precision={precisionButton}
                  onThresholdChange={onThresholdReceive}
                />
              </Card>
            </section>
          </section>
        </>
      )}
    </div>
  );
};

export default ChartView;
