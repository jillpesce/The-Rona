import React from 'react';
import PageNavbar from './PageNavbar';
import GlobalCauseRow from './GlobalCauseRow';
import Footer from './Footer';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/GlobalCauses.css';

export default class NationalCauses extends React.Component {
	constructor(props) {
		super(props);
        
        this.state = {
			selectedYear: "",
			countries: [],
			years: [],
            data: []
        };

        this.submit = this.submit.bind(this);
		this.handleYearChange = this.handleYearChange.bind(this);
	}
    
    componentDidMount() {
		console.log("got here")
		fetch("http://localhost:8081/nyears", 
        {
            method: 'GET'
        }).then(res => {
            return res.json();
        }, err => {
            console.log(err);
        }).then(yearsList => {
			if (!yearsList) return;

            let yearsDivs = yearsList.map((year, i) => 
                <option key={i} value={year.year}>{year.year}</option>
            );

            this.setState({
                years: yearsDivs,
            });
        }, err => {
            console.log(err);
        });
	}
	
	handleYearChange(e) {
		this.setState({
			selectedYear: e.target.value
		});
	}
    
    submit() {
		console.log('submit button pressed');
		fetch(`http://localhost:8081/nationalcauses/${encodeURIComponent(this.state.selectedYear)}`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(globalCausesList => {
			if (!globalCausesList) return;

			let GlobalDataDivs = globalCausesList.map((data, i) =>
				<GlobalCauseRow key={i} 
								cause={data.cause} 
								num_deaths={data.num_deaths}/>
			);

			this.setState({
				data: GlobalDataDivs
			});
		}, err => {
			console.log(err);
		});
	}


	render() {

		return (
			<div className="GlobalCauses">
				<PageNavbar active="NationalCauses" />

				<div className="container globalcauses-container">
			      <div className="jumbotron">
			        <div className="h5">National Causes of Death Per Year</div>

			        <div className="countries-container">
			          <div className="dropdown-container">
						<select value={this.state.selectedYear} onChange={this.handleYearChange} className="dropdown" id="yearsDropdown">
			            	{this.state.years}
			            </select>
			            <button className="submit-btn" id="submitBtn" onClick={this.submit}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="globalcauses-container">
			          <div className="globalcauses-header">
			            <div className="header"><strong>Cause</strong></div>
                        <div className="header"><strong>Deaths Globally</strong></div>
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