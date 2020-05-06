import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CoronaVirus from "./CoronaVirus";
import PrivateRoute from "./PrivateRoute";
import Timeline from "./Timeline";
import Dashboard from "./Dashboard";
import SignIn from "./SignIn";
import GlobalCauses from "./GlobalCauses";
import NationalCauses from "./NationalCauses";
import LifeExpCalc from "./LifeExpCalc";

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  useEffect(async () => {
    try {
      const res = await fetch("http://localhost:8081/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      });

      const data = await res.json();

      console.log("res.data: " + data);
      if (data.isAuthenticated) {
        setAuthenticated(true);
        console.log("set auth true");
      } else {
        setAuthenticated(false);
        console.log("set auth false");
      }
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  console.log("App isauthenticated = " + isAuthenticated);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <SignIn
                {...props}
                isAuthenticated={isAuthenticated}
                setAuthenticated={setAuthenticated}
              />
            )}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            exact
            path="/dashboard"
            component={Dashboard}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            exact
            path="/coronavirus"
            component={CoronaVirus}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            exact
            path="/timeline"
            component={Timeline}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            exact
            path="/GlobalCauses"
            component={GlobalCauses}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            exact
            path="/NationalCauses"
            component={NationalCauses}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            exact
            path="/LifeExpCalc"
            component={LifeExpCalc}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
