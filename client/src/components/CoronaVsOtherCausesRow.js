import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CoronaVsOtherCausesRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
<<<<<<< HEAD
=======
>>>>>>> c9fbe5ce1b8d4cee0c51e7aa6f3c75041004afcf
		return (
			<div className="coronavsotherResults">
				<div className="cause">{this.props.cause}</div>
				<div className="num">{this.props.num}</div>
			</div>
		);
	}
}