import React from "react";
import Modal from "./modal.js";
import Nav from "./nav.js"
import dispatcher from "../dispatcher.js"
import {facebookAuth} from "../actions/authenticationActions.js"
import {existingSession} from "../actions/authenticationActions.js"
import AuthStore from "../stores/authenticationStore.js"
export default class layout extends React.Component{
  constructor(){
    super();
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '263327560776542',
        xfbml      : true,
        version    : 'v2.8'
      });
      FB.AppEvents.logPageView();
      FB.getLoginStatus(function(response) {
        //May not need this
        })
      };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

  }

  login(){
    FB.login(function(response) {
      if (response.status === 'connected') {
        facebookAuth(response.authResponse.accessToken);
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
      }
    });
  };

  logout(){
    FB.logout(function(response){
      console.log("Logged out");
      dispatcher.dispatch({
        type: "GET_LOGIN_INFO",
        response,
      });
    });
  }

  render(){
    const {location} = this.props;
    return(
      <div>
        <Nav location={location}/>
        {this.props.children}
        <Modal login={this.login.bind(this)}/>
      </div>
    );
  }
}
