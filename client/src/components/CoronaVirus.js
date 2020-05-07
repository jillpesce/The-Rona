import React from "react";
import PageNavbar from "./PageNavbar";
import CoronaVirusRow from "./CoronaVirusRow";
import CoronaVsOtherCausesRow from "./CoronaVsOtherCausesRow";
import Footer from "./Footer";

import "bootstrap/dist/css/bootstrap.min.css";
import "../style/CoronaVirus.css";

import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

export default class CoronaVirus extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      cache: new Map(),
      currentGlobalConfirmed: undefined,
      currentGlobalRecovered: undefined,
      currentGlobalDeaths: undefined,
      selectedCountry: "",
      submittedCountry: "",
      countries: [],
      data: [],
      otherCauses: [],
      labels: [],
      stateTwo: {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
          {
            label: "Rainfall",
            backgroundColor: "rgba(75,192,192,1)",
            borderColor: "rgba(0,0,0,1)",
            borderWidth: 2,
            data: [65, 59, 80, 81, 56],
          },
        ],
      },
    };

    this.submitCountry = this.submitCountry.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8081/cvcountries", {
      method: "GET",
    })
      .then(
        (res) => {
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then(
        (countriesList) => {
          if (!countriesList) return;

          let countriesDivs = countriesList.map((country, i) => (
            <option key={i} value={country.country}>
              {country.country}
            </option>
          ));

          this.setState({
            countries: countriesDivs,
            selectedCountry: countriesList[0].country,
          });
        },
        (err) => {
          console.log(err);
        }
      );

    fetch("http://localhost:8081/globalstats", {
      method: "GET",
    })
      .then(
        (res) => {
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then(
        (globalStats) => {
          if (!globalStats) return;

          this.setState({
            currentGlobalConfirmed: globalStats[0].confirmed,
            currentGlobalRecovered: globalStats[0].recovered,
            currentGlobalDeaths: globalStats[0].deaths,
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  handleChange(e) {
    this.setState({
      selectedCountry: e.target.value,
    });
  }

  submitCountry() {
    console.log("submit button pressed");
    if (this.state.cache.has(this.state.selectedCountry)) {
      console.log(this.state.selectedCountry + "is in the cache");
      let coronaDataList = this.state.cache.get(this.state.selectedCountry);

      let coronaDataDivs = coronaDataList.map((data, i) => (
        <CoronaVirusRow
          key={i}
          date={data.date_checked}
          confirmed={data.confirmed}
          recovered={data.recovered}
          deaths={data.deaths}
          confirmed_globally={data.confirmed_glob}
          recovered_globally={data.recovered_glob}
          deaths_globally={data.deaths_glob}
        />
      ));

      let labels = [];
          let countryCases = [];
          let recoveredCases = [];
          let deaths = [];
          let globalCases = [];
          coronaDataList.forEach((elem) => {
            labels.push(elem.date_checked);
            countryCases.push(elem.confirmed);
            globalCases.push(elem.confirmed_glob);
            recoveredCases.push(elem.recovered);
            deaths.push(elem.deaths);
          });

          this.setState({
            submittedCountry: this.state.selectedCountry,
            data: coronaDataDivs,
            labels: labels,
            datasets: [
              {
                label: `Confirmed Cases`,
                fill: false,
                lineTension: 0.5,
                backgroundColor: "rgba(0,0,255,0.5)",
                borderColor: "rgba(0,0,255,0.5)",
                borderWidth: 2,
                data: countryCases,
              },
              {
                label: `Recovered Cases`,
                fill: false,
                lineTension: 0.5,
                backgroundColor: "rgba(0,255,0,0.5)",
                borderColor: "rgba(0,255,0,0.5)",
                borderWidth: 2,
                data: recoveredCases,
              },
              {
                label: "Death Cases",
                fill: false,
                lineTension: 0.5,
                backgroundColor: "rgba(255,0,0,0.5)",
                borderColor: "rgba(255,0,0,0.5)",
                borderWidth: 2,
                data: deaths,
              },
            ],
          });
    } else {
      console.log(this.state.selectedCountry + 'is NOT in the cache');
      fetch(`http://localhost:8081/coronavirus/'${this.state.selectedCountry}'`, {
        method: "GET",
      })
        .then(
          (res) => {
            return res.json();
          },
          (err) => {
            console.log(err);
          }
        )
        .then(
          (coronaDataList) => {
            if (!coronaDataList) return;
  
            let coronaDataDivs = coronaDataList.map((data, i) => (
              <CoronaVirusRow
                key={i}
                date={data.date_checked}
                confirmed={data.confirmed}
                recovered={data.recovered}
                deaths={data.deaths}
                confirmed_globally={data.confirmed_glob}
                recovered_globally={data.recovered_glob}
                deaths_globally={data.deaths_glob}
              />
            ));
  
            this.state.cache.set(this.state.selectedCountry, coronaDataList);
  
            let labels = [];
            let countryCases = [];
            let recoveredCases = [];
            let deaths = [];
            let globalCases = [];
            coronaDataList.forEach((elem) => {
              labels.push(elem.date_checked);
              countryCases.push(elem.confirmed);
              globalCases.push(elem.confirmed_glob);
              recoveredCases.push(elem.recovered);
              deaths.push(elem.deaths);
            });
  
            this.setState({
              submittedCountry: this.state.selectedCountry,
              data: coronaDataDivs,
              labels: labels,
              datasets: [
                {
                  label: `Confirmed Cases`,
                  fill: false,
                  lineTension: 0.5,
                  backgroundColor: "rgba(0,0,255,0.5)",
                  borderColor: "rgba(0,0,255,0.5)",
                  borderWidth: 2,
                  data: countryCases,
                },
                {
                  label: `Recovered Cases`,
                  fill: false,
                  lineTension: 0.5,
                  backgroundColor: "rgba(0,255,0,0.5)",
                  borderColor: "rgba(0,255,0,0.5)",
                  borderWidth: 2,
                  data: recoveredCases,
                },
                {
                  label: "Death Cases",
                  fill: false,
                  lineTension: 0.5,
                  backgroundColor: "rgba(255,0,0,0.5)",
                  borderColor: "rgba(255,0,0,0.5)",
                  borderWidth: 2,
                  data: deaths,
                },
              ],
            });
          },
          (err) => {
            console.log(err);
          }
        );
    }

    fetch(
      `http://localhost:8081/coronaVsOtherCauses/'${this.state.selectedCountry}'`,
      {
        method: "GET",
      }
    )
      .then(
        (res) => {
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then(
        (otherCausesList) => {
          if (!otherCausesList) return;

          let otherCausesDivs = otherCausesList.map((cause, i) => (
            <CoronaVsOtherCausesRow
              key={i}
              cause={cause.cause}
              num={cause.num}
            />
          ));

          let causeLabels = [];
          let numDeaths = [];
          otherCausesList.forEach((elem) => {
            causeLabels.push(elem.cause);
            numDeaths.push(elem.num);
          });

          this.setState({
            otherCauses: otherCausesDivs,
            stateTwo: {
              labels: causeLabels,
              datasets: [
                {
                  label: "Number of Deaths",
                  backgroundColor: "rgba(75,192,192,1)",
                  borderColor: "rgba(0,0,0,1)",
                  borderWidth: 2,
                  data: numDeaths,
                },
              ],
            },
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  render() {
    return (
      <div className="CoronaVirus">
        <PageNavbar active="coronavirus" />
        <div className="container coronavirus-container">
          <div className="global-statistics-contrainer">
            <div className="overview">
              <h1 className="overview-title">Coronavirus Statistics</h1>
            </div>
            <div className="global-statistics">
              <div className="global-confirmed-stat">
                <div className="stat-val-confirmed">
                  {this.state.currentGlobalConfirmed &&
                    this.state.currentGlobalConfirmed.toLocaleString()}
                </div>
                <p className="stat">Global Confirmed</p>
              </div>
              <div className="global-recovered-stat">
                <div className="stat-val-recovered">
                  {this.state.currentGlobalRecovered &&
                    this.state.currentGlobalRecovered.toLocaleString()}
                </div>
                <p className="stat">Global Recovered</p>
              </div>
              <div className="global-deaths-stat">
                <div className="stat-val-deaths">
                  {this.state.currentGlobalDeaths &&
                    this.state.currentGlobalDeaths.toLocaleString()}
                </div>
                <p className="stat">Global Deaths</p>
              </div>
            </div>
          </div>
          <div className="jumbotron">
            <div className="h5">Coronavirus</div>
            <p>Please select a country to view its case statistics.</p>
            <div className="countries-container">
              <div className="dropdown-container">
                <select
                  value={this.state.selectedCountry}
                  onChange={this.handleChange}
                  className="dropdown"
                  id="countriesDropdown"
                >
                  {this.state.countries}
                </select>
                <button
                  className="submit-btn"
                  id="countriesSubmitBtn"
                  onClick={this.submitCountry}
                >
                  Submit
                </button>
              </div>
            </div>
            <br/><span>Results from<a href="https://www.kaggle.com/imdevskp/corona-virus-report://data.worldbank.org/indicator/SP.POP.TOTL" target="_blank"> COVID-19 Dataset, 2019</a></span>

          </div>
          <div>
            {this.state.selectedCountry !== "" && this.state.datasets && (
              <Line
                data={this.state}
                options={{
                  title: {
                    display: true,
                    text: this.state.submittedCountry + `'s Case Statistics`,
                    fontSize: 20,
                  },
                  height: 50,
                  width: 50,
                  legend: {
                    display: true,
                    position: "right",
                  },
                  scales: {
                    xAxes: [
                      {
                        type: "time",
                        ticks: {
                          autoSkip: true,
                          maxTicksLimit: 20,
                        },
                      },
                    ],
                  },
                }}
              />
            )}
          </div>
          <div className="chloe">
            {this.state.selectedCountry !== "" && this.state.datasets && (
              <div>
                <div className="jumbotron">
                  <div className="coronadata-container">
                    <div className="coronadata-header">
                      <div className="header">
                        <strong>Date</strong>
                      </div>
                      <div className="header">
                        <strong>Confirmed</strong>
                      </div>
                      <div className="header">
                        <strong>Recovered</strong>
                      </div>
                      <div className="header">
                        <strong>Deaths</strong>
                      </div>
                      <div className="header">
                        <strong>Confirmed Globally</strong>
                      </div>
                      <div className="header">
                        <strong>Recovered Globally</strong>
                      </div>
                      <div className="header">
                        <strong>Deaths Globally</strong>
                      </div>
                    </div>
                    <div className="results-container" id="results">
                      {this.state.data}
                    </div>
                  </div>
                </div>
                {this.state.selectedCountry !== "US" && (
                  <div>
                    <div>
                      Below, you can see how COVID-19's death toll compares with
                      other leading causes of death in{" "}
                      {this.state.submittedCountry}.
                    </div>
                    <Bar
                      data={this.state.stateTwo}
                      options={{
                        title: {
                          display: true,
                          text:
                            "Causes of Death in " + this.state.submittedCountry,
                          fontSize: 20,
                        },
                        legend: {
                          display: true,
                          position: "right",
                        },
                      }}
                    />
                    <div className="jumbotron">
                      <div className="coronavsother-container">
                        <div className="coronavsother-header">
                          <div className="header">
                            <strong>Cause</strong>
                          </div>
                          <div className="header">
                            <strong>Number of Deaths</strong>
                          </div>
                        </div>
                        <div
                          className="coronavsother-results-container"
                          id="other-results"
                        >
                          {this.state.otherCauses}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}
