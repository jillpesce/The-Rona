import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CoronaVirusRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props);
		return (
			<div className="coronaResults">
				<div className="date">{this.props.date}</div>
				<div className="confirmed">{this.props.confirmed.toLocaleString()}</div>
                <div className="recovered">{this.props.recovered.toLocaleString()}</div>
                <div className="deaths">{this.props.deaths.toLocaleString()}</div>
                <div className="confirmed_globally">{this.props.confirmed_globally.toLocaleString()}</div>
                <div className="recovered_globally">{this.props.recovered_globally.toLocaleString()}</div>
                <div className="deaths_globally">{this.props.deaths_globally.toLocaleString()}</div>
			</div>
		);
	}
}