import React from 'react';
import PageNavbar from './PageNavbar';
import CorrelationRow from './CorrelationRow';
import Footer from "./Footer";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Correlation.css';
import {Scatter} from 'react-chartjs-2';

export default class Correlation extends React.Component {
	constructor(props) {
		super(props);
        
        this.state = {
			selectedCountry: "",
			selectedCause: "",
			submittedCountry: "",
			submittedCause: "",
			tooltips: "",
			countries: [],
			causes: [],
			data: [],

			// init data
			// graphState : {
			// 	labels: [],
			// 	datasets: [
			// 	  {
			// 		label: 'Number of Deaths',
			// 		backgroundColor: 'rgba(75,192,192,1)',
			// 		borderColor: 'rgba(0,0,0,1)',
			// 		borderWidth: 2,
			// 		data: []
			// 	  }
			// 	]
			//   }
        };

        this.submit = this.submit.bind(this);
		this.handleCountryChange = this.handleCountryChange.bind(this);
		this.handleCauseChange = this.handleCauseChange.bind(this);
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

				let causesDivs = [];

				causesDivs = causesList.map((cause, i) =>
					<option key={i} value={cause.cause}>{cause.cause}</option>
				);

				this.setState({
					causes: causesDivs,
					selectedCause1: causesList[0].cause,
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
		console.log('submit button pressed');
		fetch(`http://localhost:8081/gcorrelation/${encodeURIComponent(this.state.selectedCountry)}/${encodeURIComponent(this.state.selectedCause)}`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(correlationList => {
			this.state.submittedCause = this.state.selectedCause;
			this.state.submittedCountry = this.state.selectedCountry;
			if (!correlationList) return;

			let CorrelationDivs = correlationList.map((data, i) =>
				<CorrelationRow key={i} 
								year={data.year}
								country={data.country} 
								cause={data.cause} 
								population={data.population} 
								num_deaths={data.num}/>
			);

			let labels = [];
			let points = [];
			correlationList.forEach(elem => {
				labels.push(elem.year)
				points.push({
					x: elem.population,
					y: elem.num
				})
			})

            this.setState({
				data: CorrelationDivs,
				graphState : {
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
						label: function(tooltipItem, data) {
						var label = data.labels[tooltipItem.index];
						return label + ' - Population: ' + tooltipItem.xLabel + ', Num deaths: ' + tooltipItem.yLabel;
						}
				 	}
				}
            });
		}, err => {
			console.log(err);
		});
	}


	render() {

		return (
			<div className="GlobalCauses">
				<PageNavbar active="GlobalCauses" />

				<div className="container globalcauses-container">
			      <div className="jumbotron">
			        <div className="h5">Correlation between Population and Causes of Death</div>
					<p>Choose a country and a causes of death to analyze.</p>

			        <div className="countries-container">
			          <div className="dropdown-container">
					  <select value={this.state.selectedCountry} onChange={this.handleCountryChange} className="dropdown" id="countriesDropdown">
									{this.state.countries}
								</select>
								<select value={this.state.selectedCause} onChange={this.handleCauseChange} className="dropdown" id="causeDropdown">
									{this.state.causes}
								</select>
			            <button className="submit-btn" id="submitBtn" onClick={this.submit}>Submit</button>
			          </div>
			        </div>
			      </div>
				  {this.state.selectedYear !== "" && this.state.data && (
				  <Scatter
					data={this.state.graphState}
					options={{
						title:{
						display:true,
						text:'Population vs. ' + this.state.submittedCause + " in " +this.state.submittedCountry,
						fontSize:20
						},
						legend:{
							display:true,
							position:'right'
						},
						scales: {
							xAxes: [ {
							display: true,
							scaleLabel: {
								display: true,
								labelString: 'Population'
							},
							} ],
							yAxes: [ {
							display: true,
							scaleLabel: {
								display: true,
								labelString: 'Number of deaths due to ' +this.state.submittedCause
							}
							} ]
						},
						tooltips: this.state.tooltips
					}}
					/>
				  )}
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
			    </div>
				<Footer></Footer>
			</div>
		);
	}
}