import React from "react";
import { Link } from "react-router";
import AuthenticationStore from "../stores/authenticationStore.js";
export default class Header extends React.Component{
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

  getHtml(){
    if(this.state.authenticated == true){
      return(
        <span> <a style={{color: "white"}}>or</a> <a data-toggle="modal" data-target=".modal-postmeal" class="btn btn-primary btn-xl page-scroll">Post a meal</a></span>
      );
    }
    else {
      return("");
    }
  }

  render(){
    return(
      <div class="text text-center" style={{backgroundImage: "url(../../img/header.jpg)", backgroundSize:"100% 100%"}}>
        <div class="header-content" style={{paddingTop: "15%", paddingBottom: "20%"}}>
          <div class="header-content-inner">
            <h1 id="homeHeading" style={{color:"white"}}>ByMEAL</h1>
            <hr/>
            <div id="custom-search-input">
              <div class="row">
                <div class="input-group col-md-12">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-md-12 col-sm-12 col-xs-12 input-group">
                        <div class="form-group">
                          <input class="input-lg" style={{color:"black"}} type="text" placeholder="Pizzas in Porto" disabled="disabled"/>
                          <input class="input-lg" style={{color:"black"}} id="date" name="date" placeholder="MM/DD/YYY" type="text" disabled="disabled"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p></p>
          <Link to="searchmeal"><button class="btn btn-primary btn-xl page-scroll">Pick my meal!</button></Link>{this.getHtml()}
        </div>
      </div>
    );
  }
}
