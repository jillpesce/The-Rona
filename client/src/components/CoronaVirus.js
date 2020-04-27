import React from 'react';
import PageNavbar from './PageNavbar';
import CoronaVirusRow from './CoronaVirusRow';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/CoronaVirus.css';
import {Line} from 'react-chartjs-2';

export default class CoronaVirus extends React.Component {
	constructor(props) {
		super(props);
        
        this.state = {
            selectedCountry: "",
            countries: [],
			data: [],
			labels: []
        };

        this.submitCountry = this.submitCountry.bind(this);
		//this.submitDecade = this.submitDecade.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
    
    componentDidMount() {
        fetch("http://localhost:8081/cvcountries", 
        {
            method: 'GET'
        }).then(res => {
            return res.json();
        }, err => {
            console.log(err);
        }).then(countriesList => {
			if (!countriesList) return;
			
			console.log(typeof countriesList);
			console.log(countriesList);

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
    }

	handleChange(e) {
		this.setState({
			selectedCountry: e.target.value
		});
	}
    
    submitCountry() {
		console.log('submit button pressed');
		fetch(`http://localhost:8081/coronavirus/'${this.state.selectedCountry}'`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(coronaDataList => {
			if (!coronaDataList) return;

			console.log(typeof coronaDataList);
			console.log(coronaDataList);

			let coronaDataDivs = coronaDataList.map((data, i) =>
                <CoronaVirusRow key={i} date={data.date_checked} confirmed={data.confirmed}
                    recovered={data.recovered} deaths={data.deaths} 
                    confirmed_globally={data.confirmed_glob}
                    recovered_globally={data.recovered_glob}
                    deaths_globally={data.deaths_glob}/>
			);

			let labels = [];
			let countryCases = [];
			let recoveredCases = [];
			let deaths = [];
			let globalCases = [];
			coronaDataList.forEach(elem => {
				labels.push(elem.date_checked);
				countryCases.push(elem.confirmed);
				globalCases.push(elem.confirmed_glob);
				recoveredCases.push(elem.recovered);
				deaths.push(elem.deaths);
			})

			this.setState({
				data: coronaDataDivs,
				labels: labels,
				datasets: [
					{
					label: `Confirmed Cases`,
					fill: false,
					lineTension: 0.5,
					backgroundColor: 'rgba(0,0,255,0.5)',
					borderColor: 'rgba(0,0,255,0.5)',
					borderWidth: 2,
					data: countryCases
					},
					{
						label: `Recovered Cases`,
						fill: false,
						lineTension: 0.5,
						backgroundColor: 'rgba(0,255,0,0.5)',
						borderColor: 'rgba(0,255,0,0.5)',
						borderWidth: 2,
						data: recoveredCases
					}, 
					{
						label: 'Death Cases',
						fill: false,
						lineTension: 0.5,
						backgroundColor: 'rgba(255,0,0,0.5)',
						borderColor: 'rgba(255,0,0,0.5)',
						borderWidth: 2,
						data: deaths
					}
				]
			});
		}, err => {
			console.log(err);
		});
	}


	render() {

		return (
			<div className="CoronaVirus">
				<PageNavbar active="coronavirus" />

				<div className="container coronavirus-container">
			      <div className="jumbotron">
			        <div className="h5">Coronavirus</div>
					<p>Please select a country to view its case statistics.</p>
			        <div className="countries-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedCountry} onChange={this.handleChange} className="dropdown" id="countriesDropdown">
			            	{this.state.countries}
			            </select>
			            <button className="submit-btn" id="countriesSubmitBtn" onClick={this.submitCountry}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="coronadata-container">
			          <div className="coronadata-header">
			            <div className="header"><strong>Date</strong></div>
			            <div className="header"><strong>Confirmed</strong></div>
                        <div className="header"><strong>Recovered</strong></div>
                        <div className="header"><strong>Deaths</strong></div>
                        <div className="header"><strong>Confirmed Globally</strong></div>
                        <div className="header"><strong>Recovered Globally</strong></div>
                        <div className="header"><strong>Deaths Globally</strong></div>
			          </div>
			          <div className="results-container" id="results">
			            {this.state.data}
			          </div>
			        </div>
			      </div>

			<div>
				  {this.state.selectedCountry !== "" && this.state.datasets && (

			<Line
			data={this.state}
			options={{
				title:{
				display:true,
				text: this.state.selectedCountry + `'s Case Statistics`,
				fontSize:20
				},
				height: 50,
				width: 50,
				legend:{
				display:true,
				position:'right'
				},
				scales: {
					xAxes: [{
						type: 'time',
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
			    </div>
			</div>
		);
	}
}