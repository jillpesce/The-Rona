import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import CoronaVirus from './CoronaVirus';
import Timeline from './Timeline'

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<CoronaVirus />
							)}
						/>
						<Route
							exact
							path="/coronavirus"
							render={() => (
								<CoronaVirus />
							)}
						/>
						<Route
							exact
							path="/timeline"
							render={() => (
								<Timeline />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}