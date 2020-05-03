import React from 'react';

import PageNavbar from './PageNavbar';
import TimelineRow from './TimelineRow';
import '../style/Timeline.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Line } from 'react-chartjs-2';
import { green } from 'color-name';


export default class Timeline extends React.Component {
	constructor(props) {
		super(props);
		this.chartReference = React.createRef();

		this.state = {
			selectedCountry: "",
			selectedCause1: "",
			selectedCause2: "",
			submittedCountry: "",
			submittedCause1: "",
			submittedCause2: "",
			isSubmitted: false,
			cause1Avg: 0,
			cause2Avg: 0,
			countries: [],
			causes: [],
			data: [],
			labels: [],
			peakYears: []
		};

		this.submit = this.submit.bind(this);
		this.handleCountryChange = this.handleCountryChange.bind(this);
		this.handleCause1Change = this.handleCause1Change.bind(this);
		this.handleCause2Change = this.handleCause2Change.bind(this);

	}

	componentDidMount() {
		fetch("http://localhost:8081/gccountries",
			{
				method: 'GET'
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(countriesList => {
				if (!countriesList) return;

				let countriesDivs = countriesList.map((country, i) =>
					<option key={i} value={country.country}>{country.country}</option>
				);

				this.setState({
					countries: countriesDivs,
					selectedCountry: countriesList[0].country
				});
			}, err => {
				console.log(err);
			});
		fetch("http://localhost:8081/gccauses",
			{
				method: 'GET'
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(causesList => {
				if (!causesList) return;

				let causesDivs = causesList.map((cause, i) =>
					<option key={i} value={cause.cause}>{cause.cause}</option>
				);

				this.setState({
					causes: causesDivs,
					selectedCause1: causesList[0].cause,
					selectedCause2: causesList[0].cause,
				});
			}, err => {
				console.log(err);
			});
	}

	handleCountryChange(e) {
		this.setState({
			selectedCountry: e.target.value
		});
	}

	handleCause1Change(e) {
		this.setState({
			selectedCause1: e.target.value
		});
	}

	handleCause2Change(e) {
		this.setState({
			selectedCause2: e.target.value
		});
	}

	submit() {
		this.setState({
			isSubmitted: true
		});
		fetch(`http://localhost:8081/timeline/${encodeURIComponent(this.state.selectedCountry)}
		/${encodeURIComponent(this.state.selectedCause1)}/${encodeURIComponent(this.state.selectedCause2)}`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(timelineDataList => {
			if (!timelineDataList) return;

			let timelineDataDivs = timelineDataList.map((data, i) =>
				<TimelineRow key={i} year={data.year}
					deaths_cause1={data.deaths_cause1}
					deaths_cause2={data.deaths_cause2} />
			);

			let labels = [];
			let cause1 = [];
			let cause2 = [];

			timelineDataList.forEach(elem => {
				labels.push(elem.year);
				cause1.push(elem.deaths_cause1);
				cause2.push(elem.deaths_cause2);
			})

			this.setState({
				submittedCountry: this.state.selectedCountry,
				submittedCause1: this.state.selectedCause1,
				submittedCause2: this.state.selectedCause2,
				data: timelineDataDivs,
				labels: labels,
				datasets: [
					{
						label: `${this.state.selectedCause1}`,
						fill: false,
						lineTension: 0.5,
						backgroundColor: 'rgba(0,0,255,0.5)',
						borderColor: 'rgba(0,0,255,0.5)',
						borderWidth: 2,
						data: cause1
					},
					{
						label: `${this.state.selectedCause2}`,
						fill: false,
						lineTension: 0.5,
						backgroundColor: 'rgba(0,255,0,0.5)',
						borderColor: 'rgba(0,255,0,0.5)',
						borderWidth: 2,
						data: cause2
					}
				]
			});
		}, err => {
			console.log(err);
		});
		//get peak years 
		fetch(`http://localhost:8081/timeline/${encodeURIComponent(this.state.selectedCountry)}
		/${encodeURIComponent(this.state.selectedCause1)}`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(timelinePeakList => {
			if (!timelinePeakList) return;

			let years = [];

			timelinePeakList.forEach(elem => {
				years.push(elem.year);
			})
			this.setState({
				peakYears: years
			});
		}, err => {
			console.log(err);
		});
		//get avg num deaths
		fetch(`http://localhost:8081/timeline/average/${encodeURIComponent(this.state.selectedCountry)}
		/${encodeURIComponent(this.state.selectedCause1)}/${encodeURIComponent(this.state.selectedCause2)}`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(timelineAvg => {
			if (!timelineAvg) return;

			this.setState({
				cause1Avg: Math.round(timelineAvg[0].avg1),
				cause2Avg: Math.round(timelineAvg[0].avg2)
			});

			console.log(this.chartReference);

		}, err => {
			console.log(err);
		});
	}


	render() {

		return (
			<div className="Timeline">
				<PageNavbar active="timeline" />

				<div className="container timeline-container">
					<div className="jumbotron">
						<div className="h5">Timeline</div>
						<p>Choose a country and 2 causes of death to compare.</p>
						<div className="countries-container">
							<div className="dropdown-container">
								<select value={this.state.selectedCountry} onChange={this.handleCountryChange} className="dropdown" id="countriesDropdown">
									{this.state.countries}
								</select>
								<select value={this.state.selectedCause1} onChange={this.handleCause1Change} className="dropdown" id="cause1Dropdown">
									{this.state.causes}
								</select>
								<select value={this.state.selectedCause2} onChange={this.handleCause2Change} className="dropdown" id="cause2Dropdown">
									{this.state.causes}
								</select>
								<button className="submit-btn" id="submitBtn" onClick={this.submit}>Submit</button>
							</div>
						</div>
					</div>
					{this.state.isSubmitted && (
						<div className="statistics-container">
							<div className="overview">
								<h1 className="overview-title">{this.state.submittedCountry}'s Statistics</h1>
							</div>
							<div className="statistics">
								<div className="cause1-stat">
									<div className="stat-val-cause1">
										{this.state.cause1Avg}
									</div>
									<p className="stat">Average Deaths By {this.state.submittedCause1}</p>
								</div>
								<div className="cause2-stat">
									<div className="stat-val-cause2">{this.state.cause2Avg}</div>
									<p className="stat">Average Deaths by {this.state.submittedCause2}</p>
								</div>
							</div>
						</div>)}
					<div>
						{this.state.isSubmitted && (

							<Line
								ref={this.chartReference}
								data={this.state}
								options={{
									color: [ 'red', 
									'blue', 
								'green'],
									height: 50,
									width: 50,
									legend: {
										display: true,
										position: 'right'
									},
									scales: {
										xAxes: [{
											ticks: {
												autoSkip: true,
												maxTicksLimit: 20
											}
										}]

									}
								}}
							/>
						)}

					</div>
					<div className="jumbotron">
						<div className="timelinedata-container">
							<div className="timelinedata-header">
								<div className="header"><strong>Year</strong></div>
								<div className="header"><strong>Deaths by {this.state.selectedCause1}</strong></div>
								<div className="header"><strong>Deaths by {this.state.selectedCause2}</strong></div>
							</div>
							<div className="results-container" id="results">
								{this.state.data}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}