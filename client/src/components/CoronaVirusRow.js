import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CoronaVirusRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="coronaResults">
				<div className="date">{this.props.date}</div>
				<div className="confirmed">{this.props.confirmed}</div>
                <div className="recovered">{this.props.recovered}</div>
                <div className="deaths">{this.props.deaths}</div>
                <div className="confirmed_globally">{this.props.confirmed_globally}</div>
                <div className="recovered_globally">{this.props.recovered_globally}</div>
                <div className="deaths_globally">{this.props.deaths_globally}</div>
			</div>
		);
	}
}