import React from "react";
import PageNavbar from "./PageNavbar";
import Footer from "./Footer";

import "bootstrap/dist/css/bootstrap.min.css";
import "../style/LifeExpCalc.css";
import "../style/Timeline.css";
import { Line } from "react-chartjs-2";

export default class LifeExpCalc extends React.Component {
  constructor(props) {
    super(props);
    this.chartReference = React.createRef();

    this.state = {
      cache: new Map(),
      selectedCountry: "",
      countries: [],
      //years: [],
      data: [],
      labels: [],
      isSubmitted: false,
    };

    this.submit = this.submit.bind(this);
    this.handleCountry = this.handleCountry.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8081/leccountries", {
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

          console.log(typeof countriesList);
          console.log(countriesList);

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
  }

  handleCountry(e) {
    this.setState({
      selectedCountry: e.target.value,
    });
  }

  submit() {
    if (this.state.cache.has(this.state.selectedCountry)) {
      let avgLifeExpList = this.state.cache.get(this.state.selectedCountry);

      let labels = [];
      let avgYears = [];
      avgLifeExpList.forEach((elem) => {
        labels.push(elem.year);
        avgYears.push(elem.avg_life_expectancy);
      });

      this.setState({
        isSubmitted: true,
        labels: labels,
        datasets: [
          {
            label: `${this.state.selectedCountry}`,
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(0,0,255,0.5)",
            borderColor: "rgba(0,0,255,0.5)",
            borderWidth: 2,
            data: avgYears,
          },
        ],
      });
    } else {
      fetch(
        `http://localhost:8081/lifeexpcalc/'${this.state.selectedCountry}'`,
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
          (avgLifeExpList) => {
            if (!avgLifeExpList) {
              console.log("no results :(");
              return;
            }
            console.log(typeof avgLifeExpList);
            console.log(avgLifeExpList);

            this.state.cache.set(this.state.selectedCountry, avgLifeExpList);

            let labels = [];
            let avgYears = [];
            avgLifeExpList.forEach((elem) => {
              labels.push(elem.year);
              avgYears.push(elem.avg_life_expectancy);
            });

            this.setState({
              isSubmitted: true,
              labels: labels,
              datasets: [
                {
                  label: `${this.state.selectedCountry}`,
                  fill: false,
                  lineTension: 0.5,
                  backgroundColor: "rgba(0,0,255,0.5)",
                  borderColor: "rgba(0,0,255,0.5)",
                  borderWidth: 2,
                  data: avgYears,
                },
              ],
            });
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  render() {
    return (
      <div className="LifeExpCalc">
        <PageNavbar active="lifeexpcalc" />

        <div className="container header-container">
          <div className="jumbotron">
            <div className="h5">Life Expectancy Calculator</div>
            <p>
              Please choose from the demographic categories and options below to
              calculate average life expectancy.
            </p>

            <div className="input-container">
              <div className="dropdown-container">
                <select
                  value={this.state.selectedCountry}
                  onChange={this.handleCountry}
                  className="dropdown"
                  id="countriesDropdown"
                >
                  {this.state.countries}
                </select>
                <button
                  className="submit-btn"
                  id="submitBtn"
                  onClick={this.submit}
                >
                  Submit
                </button>
              </div>
            </div>
            <br />
            <span>
              Results from
              <a
                href="https://ourworldindata.org/life-expectancy"
                target="_blank"
              >
                {" "}
                Our World in Data, 2020
              </a>
            </span>
          </div>
          <div>
            {this.state.isSubmitted && (
              <Line
                ref={this.chartReference}
                data={this.state}
                options={{
                  title: {
                    display: true,
                    text: this.state.selectedCountry + `'s Life Expectancy`,
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
        </div>
        <br />
        <br />
        <br />
        <Footer></Footer>
      </div>
    );
  }
}
