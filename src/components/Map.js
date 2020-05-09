import React from 'react';
import PageNavbar from './PageNavbar';
import CorrelationRow from './CorrelationRow';
import CorrelationRow2 from './CorrelationRow2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Correlation.css';
import Footer from './Footer';

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
		fetch(`api/gcorrelation/${encodeURIComponent(this.state.selectedCountry)}/${encodeURIComponent(this.state.selectedCause)}`, {
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
			});

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

		fetch(`api/gcorrelation2/${encodeURIComponent(this.state.selectedCountry)}/${encodeURIComponent(this.state.selectedCause)}`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(correlationList2 => {
			this.state.submittedCause = this.state.selectedCause;
			this.state.submittedCountry = this.state.selectedCountry;
			if (!correlationList2) return;

			let CorrelationDivs2 = correlationList2.map((data, i) =>
				<CorrelationRow2 key={i} 
								year={data.year}
								country={data.country} 
								cause={data.cause} 
								all_deaths={data.all_deaths} 
								num_deaths={data.num}/>
			);

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
				graphState2 : {
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
						label: function(tooltipItem, data) {
						var label = data.labels[tooltipItem.index];
						return label + ' - All Deaths: ' + tooltipItem.xLabel + ', Death by cause: '+ tooltipItem.yLabel;
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
					<script type="text/javascript" src="https://prod-useast-a.online.tableau.com/javascripts/api/viz_v1.js"></script>
					<div class="tableauPlaceholder" style={{width: '1000px', height: '750 px', backgroundColor: 'red'}}>
						<object class="tableauViz" width="1000px" height="750px" display="none">
							<param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
							<param name='embed_code_version' value='3' />
							<param name='site_root' value='' />
							<param name='name' value='CausesofDeath_15888742397720&#47;GlobalCausesofDeath' />
							<param name='tabs' value='no' />
							<param name='toolbar' value='yes' />
							<param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Ca&#47;CausesofDeath_15888742397720&#47;GlobalCausesofDeath&#47;1.png' /> 
							<param name='animate_transition' value='yes' />
							<param name='display_static_image' value='yes' />
							<param name='display_spinner' value='yes' />
							<param name='display_overlay' value='yes' />
							<param name='display_count' value='yes' />
							<param name='filter' value='publish=yes' />
						</object>
					</div>

					<div class='tableauPlaceholder' id='viz1588874261935' style={{position:'relative'}}>
						<noscript>
							<a href='#'>
								<img alt=' ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Ca&#47;CausesofDeath_15888742397720&#47;GlobalCausesofDeath&#47;1_rss.png'/>
							</a>
						</noscript>
						<object class='tableauViz'  style={{display: 'none', height: '750 px', backgroundColor: 'red'}}>
							<param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
							<param name='embed_code_version' value='3' />
							<param name='site_root' value='' />
							<param name='name' value='CausesofDeath_15888742397720&#47;GlobalCausesofDeath' />
							<param name='tabs' value='no' />
							<param name='toolbar' value='yes' />
							<param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Ca&#47;CausesofDeath_15888742397720&#47;GlobalCausesofDeath&#47;1.png' /> 
							<param name='animate_transition' value='yes' />
							<param name='display_static_image' value='yes' />
							<param name='display_spinner' value='yes' />
							<param name='display_overlay' value='yes' />
							<param name='display_count' value='yes' />
							<param name='filter' value='publish=yes' />
						</object>

						<script type='text/javascript'>
							var divElement = document.getElementById('viz1588874261935');
							var vizElement = divElement.getElementsByTagName('object')[0];
							{/* if ( divElement.offsetWidth > 800 ) { 
								vizElement.style.width='1000px';
								vizElement.style.height='827px';
							} else if ( divElement.offsetWidth > 500 ) { 
								vizElement.style.width='1000px';
								vizElement.style.height='827px';
							} else { 
								vizElement.style.width='100%';
								vizElement.style.height='727px';
							}                      */}
							var scriptElement = document.createElement('script');
							scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
							vizElement.parentNode.insertBefore(scriptElement, vizElement);
						</script>
						</div>                
			    </div>
				
				<Footer></Footer>
			</div>
		);
	}
}