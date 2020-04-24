import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Recommendations from './Recommendations';
import BestGenres from './BestGenres';
import CoronaVirus from './CoronaVirus';
import queryString from "query-string";
import PrivateRoute from './PrivateRoute';

const App = () => {
	const [isAuthenticated, setAuthenticated] = useState(false);

	useEffect(async () => {
		try {
			const res = await fetch('http://localhost:8081/auth/login/success', {
		      method: 'GET',
		      credentials: 'include',
		      headers: {
		        Accept: 'application/json',
		        'Content-Type': 'application/json',
		        'Access-Control-Allow-Credentials': true,
		      },
		    });

			const data = await res.json();

			console.log('res.data: ' + data);
			if (data.isAuthenticated) {
				setAuthenticated(true);
				console.log('set auth true');
			} else {
				setAuthenticated(false);
				console.log('set auth false');
			}
		} catch (err) {
			console.error(err.message);
		}
	}, []);

	return (
		<div className="App">
			<Router>
				<Switch>
					<Route
						exact
						path="/"
						render={() => (
							<Dashboard />
						)}
						isAuthenticated = {isAuthenticated}
						setAuthenticated = {setAuthenticated}
					/>
					<Route
						exact
						path="/dashboard"
						render={() => (
							<Dashboard />
						)}
					/>
					<PrivateRoute
						isAuthenticated={isAuthenticated}
						exact
						path="/coronavirus"
						component={
							CoronaVirus
						}
					/>
				</Switch>
			</Router>
		</div>
	);
}

export default App;