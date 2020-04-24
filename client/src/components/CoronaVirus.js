import React from 'react';
import PageNavbar from './PageNavbar';
import CoronaVirusRow from './CoronaVirusRow';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/CoronaVirus.css';

export default class CoronaVirus extends React.Component {
	constructor(props) {
		super(props);
        
        this.state = {
            selectedCountry: "",
            countries: [],
            data: []
        };

        this.submitCountry = this.submitCountry.bind(this);
		//this.submitDecade = this.submitDecade.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
    
    componentDidMount() {
        fetch("http://localhost:8081/countries", 
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
                countries: countriesDivs
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
                //<BestGenreRow key={i} genre={genre.genre} rating={genre.avg_rating}/>
                <CoronaVirusRow key={i} date={data.date_checked} confirmed={data.confirmed}
                    recovered={data.recovered} deaths={data.deaths} 
                    confirmed_globally={data.confirmed_glob}
                    recovered_globally={data.recovered_glob}
                    deaths_globally={data.deaths_glob}/>
			);

			this.setState({
				data: coronaDataDivs
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
			        <div className="h5">CoronaVirus</div>

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
			    </div>
			</div>
		);
	}
}