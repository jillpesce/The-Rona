import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TimelineRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="timelineResults">
				<div className="year">{this.props.year}</div>
				<div className="deaths_cause1">{this.props.deaths_cause1.toLocaleString()}</div>
                <div className="deaths_cause2">{this.props.deaths_cause2.toLocaleString()}</div>
			</div>
		);
	}
}