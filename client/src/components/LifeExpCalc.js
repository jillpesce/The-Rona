import React from "react";
import PageNavbar from "./PageNavbar";
import CoronaVirusRow from "./CoronaVirusRow";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/CoronaVirus.css";
import { Line } from "react-chartjs-2";

export default class LifeExpCalc extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRace: "",
      selectedSex: "",
      selectedYear: "",
      races: [],
      sexes: [],
      years: [],
      data: [],
    };

    this.submit = this.submit.bind(this);
    this.handleRace = this.handleRace.bind(this);
    this.handleSex = this.handleSex.bind(this);
    this.handleYear = this.handleYear.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8081/lecraces", {
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
        (racesList) => {
          if (!racesList) return;

          console.log(typeof racesList);
          console.log(racesList);

          let racesDivs = racesList.map((race, i) => (
            <option key={i} value={race.race}>
              {race.race}
            </option>
          ));

          this.setState({
            races: racesDivs,
            selectedRace: racesList[0].race,
          });
        },
        (err) => {
          console.log(err);
        }
      );
    fetch("http://localhost:8081/lecsexes", {
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
        (sexesList) => {
          if (!sexesList) return;

          let sexesDivs = sexesList.map((sex, i) => (
            <option key={i} value={sex.sex}>
              {sex.sex}
            </option>
          ));

          this.setState({
            sexes: sexesDivs,
            selectedSex: sexesList[0].sex,
          });
        },
        (err) => {
          console.log(err);
        }
      );
    fetch("http://localhost:8081/lecyears", {
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
        (yearsList) => {
          if (!yearsList) return;

          let yearsDivs = yearsList.map((year, i) => (
            <option key={i} value={year.year}>
              {year.year}
            </option>
          ));

          this.setState({
            years: yearsDivs,
            selectedYear: yearsList[0].year,
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  handleRace(e) {
    this.setState({
      selectedRace: e.target.value,
    });
  }

  handleSex(e) {
    this.setState({
      selectedSex: e.target.value,
    });
  }

  handleYear(e) {
    this.setState({
      selectedYear: e.target.value,
    });
  }

  submit() {
    console.log("submit button pressed");
    fetch(
      `http://localhost:8081/lifeexpcalc/${encodeURIComponent(
        this.state.selectedRace
      )}/${encodeURIComponent(this.state.selectedSex)}/${encodeURIComponent(
        this.state.selectedYear
      )}`,
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
        (avgLifeExp) => {
          if (!avgLifeExp) return;

          console.log(typeof avgLifeExp);
          console.log(avgLifeExp);

          // let timelineDataDivs = timelineDataList.map((data, i) =>
          //     <TimelineRow key={i} year={data.year}
          //         deaths_cause1={data.deaths_cause1}
          //         deaths_cause2={data.deaths_cause2}/>
          // );

          this.setState({
            data: avgLifeExp,
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  render() {
    return (
      <div className="Timeline">
        <PageNavbar active="timeline" />

        <div className="container timeline-container">
          <div className="jumbotron">
            <div className="h5">Life Expectancy Calculator</div>
            <p>
              Please choose from the demographic categories and options below to
              calculate average life expectancy.
            </p>
            <div className="countries-container">
              <div className="dropdown-container">
                <select
                  value={this.state.selectedRace}
                  onChange={this.handleRace}
                  className="dropdown"
                  id="racesDropdown"
                >
                  {this.state.races}
                </select>
                <select
                  value={this.state.selectedSex}
                  onChange={this.handleSex}
                  className="dropdown"
                  id="sexesDropdown"
                >
                  {this.state.sexes}
                </select>
                <select
                  value={this.state.selectedYear}
                  onChange={this.handleYear}
                  className="dropdown"
                  id="yearsDropdown"
                >
                  {this.state.years}
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
          </div>
        </div>
      </div>
    );
  }
}
