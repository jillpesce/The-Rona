import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CoronaVsOtherCausesRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props);
		return (
			<div className="coronavsotherResults">
				<div className="cause">{this.props.cause}</div>
				<div className="num">{this.props.num}</div>
			</div>
		);
	}
}