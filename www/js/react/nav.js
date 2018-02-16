import React from "react";
import AuthenticationStore from "../stores/authenticationStore.js";
import { Link } from "react-router";
import NavButtons from "./components/navButtons.js"

export default class nav extends React.Component{

  constructor(){
    super();
    this.authenticated = this.authenticated.bind(this);
    this.state = {
      authenticated: false
    };
  }

  componentWillMount(){
    this.authenticated();
  }
  componentDidMount(){
    AuthenticationStore.on("authChange", this.authenticated);
  }
  componentWillUnmount(){
    AuthenticationStore.removeListener("authChange", this.authenticated);
  }

  authenticated(){
    if (AuthenticationStore.isAuthenticated() && !AuthenticationStore.userDetail.loggedUserData)
    {
      AuthenticationStore.getOwnUserDetails( function(){

      this.setState({authenticated: AuthenticationStore.isAuthenticated(),
                    first_name:  AuthenticationStore.userDetail.loggedUserData.first_name,
                    isHost : AuthenticationStore.isHost()});
      }.bind(this))
    }
    else {
      this.setState({authenticated: AuthenticationStore.isAuthenticated(),
                    first_name: AuthenticationStore.userDetail.loggedUserData ? AuthenticationStore.userDetail.loggedUserData.first_name : ""  });
    }
  }

  updateContrast(location){
    if(location.pathname == "/"){
      if (document.body.scrollTop > 50) {
       this.document.getElementById("mainNav").className = "navbar navbar-default navbar-fixed-top affix";
     } else {
        this.document.getElementById("mainNav").className = "navbar navbar-default navbar-fixed-top affix-top";
     }
    }
  }

  render(){
    const {location} = this.props;
    const isBecomeAHost = location.pathname === "/become_host" ? "yes" : "no";
    const navContrast = location.pathname === "/" ? "affix-top" : "affix";
    const isHost = AuthenticationStore.isAuthenticated() && AuthenticationStore.isHost();

    return(
          <nav id="mainNav" class={"navbar navbar-default navbar-fixed-top " + navContrast} onWheel={() => this.updateContrast(location)}>
            <div class="container-fluid">
              <div class="navbar-header">
                <a class="navbar-brand page-scroll" href="#">byMEAL | beta</a>
                { isBecomeAHost == "yes" &&
                    <div class="nav navbar navbar-brand" id="bah-btn" >Become a Host</div>
                }
                { (isBecomeAHost == "no" && !isHost) &&
                    <Link to="become_host" class="navbar-brand page-scroll">Become a host</Link>
                }
              </div>

                  <NavButtons auth={this.state.authenticated} first_name={this.state.first_name} isHost={this.state.isHost}/>
            </div>
          </nav>
        );
      }
}
