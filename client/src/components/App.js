import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import CoronaVirus from './CoronaVirus';
import Timeline from './Timeline'
import GlobalCauses from './GlobalCauses'
import NationalCauses from './NationalCauses'

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
						<Route
							exact
							path="/GlobalCauses"
							render={() => (
								<GlobalCauses />
							)}
						/>

<Route
							exact
							path="/NationalCauses"
							render={() => (
								<NationalCauses />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}