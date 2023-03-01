import React from 'react';
import { useAuth } from './auth';
import { Redirect, Route } from 'react-router-dom';

const RequireAuth = ({ component: Component, ...rest }) => {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={props =>
        auth.user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default RequireAuth;
