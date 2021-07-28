import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ChartView from '../views/ChartView';

export const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to={{ pathname: "/build" }} />
    </Route>
    <Route exact path="/build" component={ChartView} />
  </Switch>
);
