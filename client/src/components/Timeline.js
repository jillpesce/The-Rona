import React from 'react';
import PageNavbar from './PageNavbar';
import TimelineRow from './TimelineRow';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Timeline.css';

export default class Timeline extends React.Component {
	constructor(props) {
		super(props);
        
        this.state = {
            selectedCountry: "",
            selectedCause1: "",
            selectedCause2: "",
            countries: [],
            causes: [],
            data: []
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
		console.log('submit button pressed');
		fetch(`http://localhost:8081/timeline/${encodeURIComponent(this.state.selectedCountry)}/${encodeURIComponent(this.state.selectedCause1)}/${encodeURIComponent(this.state.selectedCause2)}`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(timelineDataList => {
			if (!timelineDataList) return;

			console.log(typeof timelineDataList);
			console.log(timelineDataList);

			let timelineDataDivs = timelineDataList.map((data, i) =>
                <TimelineRow key={i} year={data.year}
                    deaths_cause1={data.deaths_cause1}
                    deaths_cause2={data.deaths_cause2}/>
			);

			this.setState({
				data: timelineDataDivs
			});
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