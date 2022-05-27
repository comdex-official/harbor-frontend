import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table } from "antd";
import TooltipIcon from "../../components/TooltipIcon";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./index.scss";
import Banner from "./Banner";

const Dashboard = ({ lang, isDarkMode }) => {
  const Options = {
    chart: {
      type: "pie",
      backgroundColor: null,
      height: 210,
      margin: 5,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    plotOptions: {
      pie: {
        showInLegend: false,
        size: "110%",
        innerSize: "82%",
        borderWidth: 0,
        dataLabels: {
          enabled: false,
          distance: -14,
          style: {
            fontsize: 50,
          },
        },
      },
    },
    series: [
      {
        states: {
          hover: {
            enabled: true,
          },
        },
        name: "",
        data: [
          {
            name: "ATOM",
            y: 60,
            color: "#665AA6",
            // color: isDarkMode ? "#373549" : "#E0E0E0",
          },
          {
            name: "CMDX",
            y: 40,
            color: "#BFA9D7",
          },
          {
            name: "Others",
            y: 30,
            color: isDarkMode ? "#373549" : "#E0E0E0",
          },
        ],
      },
    ],
  };
  const PriceChart = {
    chart: {
      type: "spline",
      backgroundColor: null,
      height: 130,
      marginBottom: 30,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    yAxis: {
      gridLineWidth: 0,
      title: {
        enabled: false,
      },
      labels: {
        enabled: true,
        style: {
          color: "#FFCEFF",
        },
      },
      categories: [null, null, "1", "2", "3", "4"],
    },
    xAxis: {
      lineColor: false,
      labels: {
        style: {
          fontSize: 10,
          color: "#FFCEFF",
          fontWeight: 300,
        },
      },
      gridLineWidth: 1,
      gridLineColor: isDarkMode ? "#6C597B" : "#FFCEFF",
      categories: [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
        "JAN",
        "FEB",
        "MAR",
      ],
    },
    series: [
      {
        showInLegend: false,
        lineWidth: 2,
        lineColor: "#665aa6",
        marker: false,
        data: [
          1.2, .9, 1.1, 1, 1, 1, 1, 1, 1.1, 1, 1, 1, .9, 1, 1.2,
        ],
      },
    ],
  };
  const HarborPrice = {
    chart: {
      type: "spline",
      backgroundColor: null,
      height: 130,
      marginBottom: 30,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    yAxis: {
      gridLineWidth: 0,
      title: {
        enabled: false,
      },
      labels: {
        enabled: true,
        style: {
          color: "#FFCEFF",
        },
      },
      categories: [null, null, "1", "2", "3", "4"],
    },
    xAxis: {
      lineColor: false,
      labels: {
        style: {
          fontSize: 10,
          color: "#FFCEFF",
          fontWeight: 300,
        },
      },
      gridLineWidth: 1,
      gridLineColor: isDarkMode ? "#6C597B" : "#FFCEFF",
      categories: [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
        "JAN",
        "FEB",
        "MAR",
      ],
    },
    series: [
      {
        showInLegend: false,
        lineWidth: 2,
        lineColor: "#665aa6",
        marker: false,
        data: [
          2, 2.5, 2.8, 3, 4, 4.5, 4.2, 4.0, 3.8, 3.2, 4, 2.9, 3.1, 2.8, 2.7,
        ],
      },
    ],
  };

  return (
    <div className="app-content-wrapper dashboard-app-content-wrapper">
      <Row>
        <Col className="dashboard-upper ">
          <div className="dashboard-upper-left ">
            <div className="composite-card  earn-deposite-card">
              <div className="dashboard-statics">
                <p className="total-value">Total Value Locked <TooltipIcon text={variables[lang].tooltip_total_value_locked} /></p>
                <h2>$15,690.00</h2>
              </div>
              <div className="totalvalues">
                <div className="totalvalues-chart">
                  <HighchartsReact highcharts={Highcharts} options={Options} />
                </div>
                <div className="totalvalues-right">
                  <div className="dashboard-statics mb-5">
                    <p>ATOM</p>
                    <h3>$12,345.00</h3>
                  </div>
                  <div className="dashboard-statics mb-5 total-dashboard-stats">
                    <p>CMDX</p>
                    <h3>$2,345.00</h3>
                  </div>
                  <div className="dashboard-statics mb-0 others-dashboard-stats">
                    <p>Others</p>
                    <h3>$345.00</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-upper-right  ">
            <div className="composite-card dashboardupper-chart earn-deposite-card ">
              <div className="dashboardupperchart-head">
                <div className="col1">
                  <small>CMST Price</small>
                  <h4>
                    $1.00 <span>0.00%</span>
                  </h4>
                </div>
                <div className="col2">
                  <small>Circulating Supply <TooltipIcon text={variables[lang].tooltip_circulating_supply_CMST} /></small>
                  <p>
                    12,500,000 <span>CMST</span>
                  </p>
                </div>
                <div className="col3">
                  <small>Market Cap <TooltipIcon text={variables[lang].tooltip_market_cap} /></small>
                  <p>$72,125,000</p>
                </div>
              </div>
              <div className="right-chart">
                <HighchartsReact highcharts={Highcharts} options={PriceChart} />
              </div>
            </div>
            <div className="composite-card ">
              <div className="composite-card dashboardupper-chart earn-deposite-card ">
                <div className="dashboardupperchart-head">
                  <div className="col1">
                    <small>HARBOR Price</small>
                    <h4>
                      $12.20 <span>2.41%</span>
                    </h4>
                  </div>
                  <div className="col2">
                    <small>Circulating Supply <TooltipIcon text={variables[lang].tooltip_circulating_supply_HARBOR} /></small>
                    <p>
                      12,500,000 <span>HARBOR</span>
                    </p>
                  </div>
                  <div className="col3">
                    <small>Market Cap <TooltipIcon text={variables[lang].tooltip_market_cap} /></small>
                    <p>$72,125,000</p>
                  </div>
                </div>
                <div className="right-chart">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={HarborPrice}
                  />
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Banner lang={lang} />
    </div>
  );
};

Dashboard.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    isDarkMode: state.theme.theme.darkThemeEnabled,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(Dashboard);
