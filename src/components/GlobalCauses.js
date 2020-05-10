import React from 'react';
import PageNavbar from './PageNavbar';
import GlobalCauseRow from './GlobalCauseRow';
import Footer from './Footer';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/GlobalCauses.css';
import {Bar} from 'react-chartjs-2';

export default class GlobalCauses extends React.Component {
	constructor(props) {
		super(props);
        
        this.state = {
			selectedYear: "",
			submittedYear: "",
			countries: [],
			years: [],
			data: [],
			causeDeaths: [],

			// init data
			graphState : {
				labels: [],
				datasets: [
				  {
					label: 'Number of Deaths',
					backgroundColor: 'rgba(75,192,192,1)',
					borderColor: 'rgba(0,0,0,1)',
					borderWidth: 2,
					data: []
				  }
				]
			  }
        };

        this.submit = this.submit.bind(this);
		this.handleYearChange = this.handleYearChange.bind(this);
	}
    
    componentDidMount() {
		fetch("/api/gyears", 
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
				selectedYear: yearsList[0].year
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
		fetch(`api/globalcauses/${encodeURIComponent(this.state.selectedYear)}`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(globalCausesList => {
			if (!globalCausesList) return;

			this.state.submittedYear = this.state.selectedYear;

			let GlobalDataDivs = globalCausesList.map((data, i) =>
				<GlobalCauseRow key={i} 
								cause={data.cause} 
								num_deaths={data.num_deaths}/>
			);

			let labels = [];
			let numDeaths = [];
			globalCausesList.forEach(elem => {
				labels.push(elem.cause)
				numDeaths.push(elem.num_deaths)
			})

            this.setState({
				data: GlobalDataDivs,
				graphState : {
					labels: labels,
					datasets: [
					  {
						label: 'Number of deaths',
						backgroundColor: 'rgba(75,192,192,1)',
						data: numDeaths
					  }
					]
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
			        <div className="h5">Global Causes of Death Per Year</div>

			        <div className="countries-container">
			          <div className="dropdown-container">
						<select value={this.state.selectedYear} onChange={this.handleYearChange} className="dropdown" id="yearsDropdown">
			            	{this.state.years}
			            </select>
			            <button className="submit-btn" id="submitBtn" onClick={this.submit}>Submit</button>
						<br/>
								<br/>
								<span>Results from<a href="https://ourworldindata.org/grapher/share-of-deaths-by-cause" target="_blank"  rel="noopener noreferrer"> the Institute for Health Metrics and Evaluation (IHME), 2018</a></span>

			          </div>
			        </div>
			      </div>
				  {this.state.submittedYear !== "" && this.state.data && (
				  <Bar
					data={this.state.graphState}
					options={{
						title:{
						display:true,
						text:'Global Causes of Death in ' + this.state.selectedYear,
						fontSize:20
						},
						legend:{
						display:false,
						position:'right'
						}
					}}
					/>
				  )}
				  
				  {this.state.submittedYear !== "" && this.state.data && (
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
				  )}
			    </div>
				<Footer></Footer>
			</div>
		);
	}
}