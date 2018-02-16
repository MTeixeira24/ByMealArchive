import React from "react";
import Login from "./components/login.js";
import Signup from "./components/signup.js";
import PostMeal from "./components/postMeal.js";
import * as AuthenticationActions from "../actions/authenticationActions.js";
import AuthenticationStore from "../stores/authenticationStore.js";

export default class modal extends React.Component{
  constructor(){
    super();
    this.authenticated = this.authenticated.bind(this);
    this.state = {
      authenticated: false
    };
  }

  componentWillMount(){
    this.setState({authenticated: AuthenticationStore.isAuthenticated()});
  }
  componentDidMount(){
    AuthenticationStore.on("authChange", this.authenticated);
  }
  componentWillUnmount(){
    AuthenticationStore.removeListener("authChange", this.authenticated);
  }

  authenticated(){
    this.setState({authenticated: AuthenticationStore.isAuthenticated()});
  }

  render(){
    if(this.state.authenticated == 0){
      return(
        <div>
          <Login login={this.props.login.bind(this)}/>
          <Signup login={this.props.login.bind(this)}/>
          <PostMeal/>
        </div>
      );
    }
    else{
      return(
        <div>
          <PostMeal/>
        </div>
      );
    }
  }
}
