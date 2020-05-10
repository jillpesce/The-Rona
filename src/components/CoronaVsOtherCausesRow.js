import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CoronaVsOtherCausesRow extends React.Component {

	render() {
		return (
			<div className="coronavsotherResults">
				<div className="cause">{this.props.cause}</div>
				<div className="num">{this.props.num.toLocaleString()}</div>
			</div>
		);
	}
}