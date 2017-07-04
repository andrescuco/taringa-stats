var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var hashHistory = ReactRouter.hashHistory;
var TextInputContainer = require('../containers/TextInputContainer');


var routes = (
  <Router history={hashHistory}>
    <Route path='/' component={TextInputContainer} >
    </Route>
  </Router>
);

module.exports = routes;
