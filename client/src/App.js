import React, { Component, Fragment, useEffect } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import LabelHome from './label/LabelHome';
import LabelingLoader from './label/LabelingLoader';
import OverScreen from './label/OverScreen';
import AdminApp from './admin/AdminApp';
import Help from './help/Help';
import Test from './label/Test';
import RequireAuth from './RequireAuth';
import Login from './login';
import { AuthProvider, useAuth } from './auth';
import { Redirect } from 'react-router-dom';

const App = () => {
  const { user } = useAuth();

  useEffect(() => {
    let token = localStorage.getItem('accessToken');
    if (!token) {
      return <Redirect to="/login" />;
    } else {
      return <Redirect to="/" />;
    }
  }, [user]);
  // render() {
  //   if (process.env.REACT_APP_DEMO) {
  //     const props = {
  //       match: {
  //         params: {
  //           projectId: 'demo',
  //           imageId: 1,
  //         },
  //       },
  //       history: {
  //         replace: () => {},
  //         push: () => {},
  //         goBack: () => {},
  //       },
  //     };
  //     return <LabelingLoader {...props} />;
  //   }

  return (
    <AuthProvider>
      <Router>
        <Fragment>
          <Route exact path="/" component={LabelHome} />
          <Route path="/admin" component={AdminApp} />
          <Route path="/help" component={Help} />
          <Route path="/login" component={Login} />
          <Route exact path="/hook" component={Test} />
          <RequireAuth path="/label/:projectId" component={LabelingLoader} />
          <Route
            exact
            path="/label/:projectId/:imageId"
            render={props =>
              props.match.params.imageId === 'over' ? (
                <OverScreen {...props} />
              ) : (
                <LabelingLoader {...props} />
              )
            }
          />
        </Fragment>
      </Router>
    </AuthProvider>
  );
};

export default App;
