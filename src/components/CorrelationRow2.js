import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CorrelationRow2 extends React.Component {

	render() {
		return (
			<div className="correlationResults2">
				<div className="year">{this.props.year}</div>
				<div className="country">{this.props.country}</div>
				<div className="all_deaths">{this.props.all_deaths.toLocaleString()}</div>
				<div className="cause">{this.props.cause}</div>
				<div className="num_deaths">{this.props.num_deaths.toLocaleString()}</div>
			</div>
		);
	}
}