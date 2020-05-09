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
import Correlation from "./Correlation";
import Map from "./Map";

const App = () => {

  return (
    <div className="App" style={{position: 'absolute', minHeight: '100vh', width: '100%'}}>
      <Router>
        <Switch>
        <Route
            exact
            path="/"
            render={(props) => (
              <Dashboard
                {...props}
              />
            )}
          />
          <PrivateRoute
            exact
            path="/dashboard"
            component={Dashboard}
          />
          <PrivateRoute
            exact
            path="/coronavirus"
            component={CoronaVirus}
          />
          <PrivateRoute
            exact
            path="/timeline"
            component={Timeline}
          />
          <PrivateRoute
            exact
            path="/GlobalCauses"
            component={GlobalCauses}
          />
          <PrivateRoute
            exact
            path="/NationalCauses"
            component={NationalCauses}
          />
          <PrivateRoute
            exact
            path="/Correlation"
            component={Correlation}
          />
          <PrivateRoute
            exact
            path="/LifeExpCalc"
            component={LifeExpCalc}
          />

          <Route path='/Map' component={() => { 
              window.location.href = 'https://public.tableau.com/profile/selina.nie#!/vizhome/CausesofDeath_15888742397720/Sheet1'; 
              return null;
          }}/>
          />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
