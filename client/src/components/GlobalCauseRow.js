import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class GlobalCauseRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props);
		return (
			<div className="globalCauseResults">
				<div className="cause">{this.props.cause}</div>
				<div className="num_deaths">{this.props.num_deaths}</div>
			</div>
		);
	}
}