import React from 'react';
import { useAuth } from './auth';
import { Redirect, Route } from 'react-router-dom';

const RequireAuth = ({ component: Component, path, ...rest }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        if (!auth.isUserReady) {
          return <div>Loading...........</div>;
        }
        if (!auth.user) {
          return <Redirect to="/login" />;
        }
        console.log(auth.user.roles);
        const isAdminUser = auth.user.roles.includes('admin');
        if (path.includes('/admin') && !isAdminUser) {
          return <Redirect to="/label" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default RequireAuth;
