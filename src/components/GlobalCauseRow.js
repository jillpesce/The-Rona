import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class GlobalCauseRow extends React.Component {


	render() {
		return (
			<div className="globalCauseResults">
				<div className="cause">{this.props.cause}</div>
				<div className="num_deaths">{this.props.num_deaths.toLocaleString()}</div>
			</div>
		);
	}
}