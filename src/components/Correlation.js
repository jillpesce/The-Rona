import React from 'react';
import PageNavbar from './PageNavbar';
import CorrelationRow from './CorrelationRow';
import Footer from "./Footer";
import CorrelationRow2 from './CorrelationRow2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Correlation.css';
import { Scatter } from 'react-chartjs-2';


export default class Correlation extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedCountry: "",
			selectedCause: "",
			submittedCountry: "",
			submittedCause: "",
			tooltips: "",
			tooltips2: "",
			countries: [],
			causes: [],
			cache: new Map(),
			data: [],
			data2: [],
		};

		this.submit = this.submit.bind(this);
		this.handleCountryChange = this.handleCountryChange.bind(this);
		this.handleCauseChange = this.handleCauseChange.bind(this);
	}

	componentDidMount() {
		fetch("/api/gccountries",
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

		fetch("/api/gccauses",
			{
				method: 'GET'
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(causesList => {
				if (!causesList) return;

				let causesDivs = [];

				causesDivs = causesList.map((cause, i) =>
					<option key={i} value={cause.cause}>{cause.cause}</option>
				);

				causesDivs.push(<option key={causesDivs.length} value="COVID-19">COVID-19</option>);

				this.setState({
					causes: causesDivs,
					selectedCause: causesList[0].cause,
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

	handleCauseChange(e) {
		this.setState({
			selectedCause: e.target.value
		});
	}

	submit() {
		this.state.submittedCause = this.state.selectedCause;
		this.state.submittedCountry = this.state.selectedCountry;
		if (this.state.cache.has(this.state.selectedCountry + this.state.selectedCause)) {
			let correlationList = this.state.cache.get(this.state.selectedCountry + this.state.submittedCause);
			this.setGraph(correlationList);
		} else {
			fetch(`api/gcorrelation/${encodeURIComponent(this.state.selectedCountry)}/${encodeURIComponent(this.state.submittedCause)}`, {
				method: 'GET',
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(correlationList => {

				this.state.cache.set(this.state.selectedCountry + this.state.selectedCause, correlationList);

				this.setGraph(correlationList);

			}, err => {
				console.log(err);
			});
		}
		fetch(`api/gcorrelation2/${encodeURIComponent(this.state.selectedCountry)}/${encodeURIComponent(this.state.submittedCause)}`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(correlationList2 => {
			if (!correlationList2) return;
			let CorrelationDivs2 = [];

			if (this.state.submittedCause === "COVID-19") {
				var i = correlationList2.length - 1;
				var data = correlationList2[i];
				CorrelationDivs2.push(<CorrelationRow2 key={i}
					year={data.year}
					country={data.country}
					cause={data.cause}
					all_deaths={data.all_deaths}
					num_deaths={data.num} />)
				var temp = [correlationList2[i]];
				correlationList2 = temp;
			} else {
				CorrelationDivs2 = correlationList2.map((data, i) =>
					<CorrelationRow2 key={i}
						year={data.year}
						country={data.country}
						cause={data.cause}
						all_deaths={data.all_deaths}
						num_deaths={data.num} />
				);
				CorrelationDivs2.pop();
				correlationList2.pop();
			}

			let labels2 = [];
			let points2 = [];

			correlationList2.forEach(elem => {
				labels2.push(elem.year)
				points2.push({
					x: elem.all_deaths,
					y: elem.num
				})
			})

			this.setState({
				data2: CorrelationDivs2,
				graphState2: {
					labels: labels2,
					datasets: [
						{
							label: 'All Deaths (x) vs. Deaths of Cause (y)',
							backgroundColor: 'rgba(75,192,192,1)',
							labels: labels2,
							data: points2
						}
					]
				},
				tooltips2: {
					callbacks: {
						label: function (tooltipItem, data) {
							var label = data.labels[tooltipItem.index];
							return label + ' - All Deaths: ' + tooltipItem.xLabel + ', Death by cause: ' + tooltipItem.yLabel;
						}
					}
				}
			});
		}, err => {
			console.log(err);
		});
	}

	setGraph(correlationList) {
		if (!correlationList) return;

		let CorrelationDivs = correlationList.map((data, i) =>
			<CorrelationRow key={i}
				year={data.year}
				country={data.country}
				cause={data.cause}
				population={data.population}
				num_deaths={data.num} />
		);

		let labels = [];
		let points = [];
		correlationList.forEach(elem => {
			labels.push(elem.year)
			points.push({
				x: elem.population,
				y: elem.num
			})
		});

		this.setState({
			data: CorrelationDivs,
			graphState: {
				labels: labels,
				datasets: [
					{
						label: 'Population (x) vs. Deaths (y)',
						backgroundColor: 'rgba(75,192,192,1)',
						labels: labels,
						data: points
					}
				]
			},
			tooltips: {
				callbacks: {
					label: function (tooltipItem, data) {
						var label = data.labels[tooltipItem.index];
						return label + ' - Population: ' + tooltipItem.xLabel + ', Num deaths: ' + tooltipItem.yLabel;
					}
				}
			}
		});
	}

	render() {

		return (
			<div className="GlobalCauses">
				<PageNavbar active="GlobalCauses" />

				<div className="container globalcauses-container">
					<div className="jumbotron">
						<div className="h5">Correlation Analysis</div>
						<p>Choose a country and a cause of death to analyze.</p>

						<div className="countries-container">
							<div className="dropdown-container">
								<select value={this.state.selectedCountry} onChange={this.handleCountryChange} className="dropdown" id="countriesDropdown">
									{this.state.countries}
								</select>
								<select value={this.state.selectedCause} onChange={this.handleCauseChange} className="dropdown" id="causeDropdown">
									{this.state.causes}
								</select>
								<button className="submit-btn" id="submitBtn" onClick={this.submit}>Submit</button>
								<br />
								<br />
								<span>Cause of Death Data from<a href="https://ourworldindata.org/grapher/share-of-deaths-by-cause" target="_blank" rel="noopener noreferrer"> the Institute for Health Metrics and Evaluation (IHME), 2018</a></span>
								<br /><span>Population Data from<a href="https://data.worldbank.org/indicator/SP.POP.TOTL" target="_blank" rel="noopener noreferrer"> the United Nations Population Division, 2019</a></span>

							</div>
						</div>
					</div>
					{this.state.submittedCause !== "" && this.state.data && (
						<Scatter
							data={this.state.graphState}
							options={{
								title: {
									display: true,
									text: 'Population vs. ' + this.state.submittedCause + " in " + this.state.submittedCountry,
									fontSize: 20
								},
								legend: {
									display: true,
									position: 'right'
								},
								scales: {
									xAxes: [{
										display: true,
										scaleLabel: {
											display: true,
											labelString: 'Population'
										},
									}],
									yAxes: [{
										display: true,
										scaleLabel: {
											display: true,
											labelString: 'Number of deaths due to ' + this.state.submittedCause
										}
									}]
								},
								tooltips: this.state.tooltips
							}}
						/>

					)}

					{this.state.submittedCause !== "" && this.state.data && (
						<Scatter
							data={this.state.graphState2}
							options={{
								title: {
									display: true,
									text: 'All Deaths vs. ' + this.state.submittedCause + " in " + this.state.submittedCountry,
									fontSize: 20
								},
								legend: {
									display: true,
									position: 'right'
								},
								scales: {
									xAxes: [{
										display: true,
										scaleLabel: {
											display: true,
											labelString: 'All Deaths'
										},
									}],
									yAxes: [{
										display: true,
										scaleLabel: {
											display: true,
											labelString: 'Number of deaths due to ' + this.state.submittedCause
										}
									}]
								},
								tooltips: this.state.tooltips2
							}}
						/>

					)}
					{this.state.submittedCause !== "" && this.state.data && (
						<div className="jumbotron">
							<div className="globalcauses-container">
								<div className="globalcauses-header">
									<div className="header"><strong>Year</strong></div>
									<div className="header"><strong>Country</strong></div>
									<div className="header"><strong>Population</strong></div>
									<div className="header"><strong>Cause</strong></div>
									<div className="header"><strong>Number of Deaths</strong></div>
								</div>
								<div className="results-container" id="results">
									{this.state.data}
								</div>
							</div>
						</div>
					)}

					{this.state.submittedCause !== "" && this.state.data2 && (
						<div className="jumbotron">
							<div className="globalcauses-container">
								<div className="globalcauses-header">
									<div className="header"><strong>Year</strong></div>
									<div className="header"><strong>Country</strong></div>
									<div className="header"><strong>All Deaths</strong></div>
									<div className="header"><strong>Cause</strong></div>
									<div className="header"><strong>Number of Deaths</strong></div>
								</div>
								<div className="results-container" id="results">
									{this.state.data2}
								</div>
							</div>
						</div>
					)}
				</div>
				<Footer></Footer>
			</div>
		);
	}
}