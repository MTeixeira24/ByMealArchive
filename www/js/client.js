import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import Layout from "./react/layout.js";
import AStr from "./stores/authenticationStore";
import HStr from "./stores/hostStore";
import dispatcher from "./dispatcher.js";
import Home from "./react/pages/home.js";
import SearchMeal from "./react/pages/searchmeal.js";
import PPolicy from "./react/pages/ppolicy.js";
import BHost from "./react/pages/becomehost.js";
import UserAccountActivation from "./react/pages/useractivation.js";
import VerifyEmail from "./react/pages/verifyemail.js";
import AssociateStripe from "./react/pages/associate_stripe.js";
import NewHost from "./react/pages/newhost.js";
import Landing from "./react/pages/landing.js";
import Preferences from "./react/pages/preferences.js";
import MyMeals from "./react/pages/mymeals.js";
import VenuePreferences from "./react/pages/venuePreferences.js"
import Hosts from './react/pages/hosts.js'
const layout = document.getElementById('layout');
var loginInformation;



ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Landing}/>
      <Route path="searchmeal" component={SearchMeal}/>
      <Route path="privacy_policy" component={PPolicy}/>
      <Route path="become_host" component={BHost}/>
      <Route path="activate_account/:user/:code" component={UserAccountActivation}/>
      <Route path="verify_email" component={VerifyEmail}/>
      <Route path="associate_stripe" component={AssociateStripe}/>
      <Route path="new_host" component={NewHost}/>
      <Route path="preferences" component={Preferences}/>
      <Route path="my_meals" component={MyMeals}/>
      <Route path="host_preferences" component={VenuePreferences}/>
      <Route path="hosts/*" component={Hosts}/>
    </Route>
  </Router>,
  layout
)
