import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component }, ...rest) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        <Component {...props} />
      }
    />
  );
};

export default PrivateRoute;
