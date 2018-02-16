import React from "react";

import * as AAct from "../../actions/authenticationActions";
import AStr from "../../stores/authenticationStore";

export default class login extends React.Component{
  constructor(){
    super();
    this.styles = AStr.getStyles();
    this.state = {errorHtml:""}
  }

  facebookLogin(e){
    this.props.login();
  }

  login(){
    const email = document.getElementById("emaillogin").value;
    const password = document.getElementById("passwordlogin").value;
    AAct.login(email,password, this.loginErrorCallback.bind(this));
  }

  loginErrorCallback(err, res) {
    this.setState({errorHtml:
             <div class="row" style={{backgroundColor:"#F88379", marginBottom:"10px"}}>
              <div class="col-sm-1 col-sm-offset-3 col-xs-2">
                <img src="./img/exclamation-mark.png" width="35px" height="35px"/>
              </div>
              <div class="col-sm-5 text-left " style={{color:"rgb(88, 85, 85"}}>
                The e-mail or password combination is not correct.
              </div>
            </div>
    })
  }

  componentDidMount(){
    var googleUser = {};
    gapi.load('auth2', function(){
         // Retrieve the singleton for the GoogleAuth library and set up the client.
         var auth2 = gapi.auth2.init({
           client_id: '23095445750-kp39laiq1e5qk7s99hpb664qirif2i1j.apps.googleusercontent.com',
           cookiepolicy: 'single_host_origin',
           // Request scopes in addition to 'profile' and 'email'
           //scope: 'additional_scope'
         });
         auth2.attachClickHandler(document.getElementById('googleLogin'), {},
             function(googleUser) {
               document.getElementById('name').innerText = "Signed in: " +
                   googleUser.getBasicProfile().getName();
             }, function(error) {
               //alert(JSON.stringify(error, undefined, 2));
             });
       });
    }

  render(){
    return(
    <div class="modal fade modal-login" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body">
            <h1 class="text-center">Login</h1>
             <div class="theme-selector"></div>

             {/*  Already have an account button */}
             <div class="text-center" style={{color: "#C1C1C1"}}>Don't have an account?
               <a class="page-scroll"
                 data-toggle="modal"
                 data-target=".modal-signup"
                 onClick={function(){$('.modal-login').modal('toggle')}}>
                 Sign up!</a>
               </div>

             {/*  Facebook button */}
             <div class="row">
               <div class="col-sm-6 col-sm-offset-3 text-center">
                 <button  style={this.styles.facebookstyle} type="button" class="btn btn-block btn-lg" onClick={this.facebookLogin.bind(this)}>
                       <span style={this.styles.facebookiconstyle}></span>Login with facebook
                 </button>
               </div>
             </div>

             {/*  Google button */}
             <div class="row">
              <div class="col-sm-6 col-sm-offset-3 text-center">
                <button id="googleLogin" style={this.styles.googlestyle} type="button" class="btn btn-block btn-lg">
                 <span style={this.styles.googleiconstyle}></span>Login with google
                </button>
                </div>
              </div>

             {/*  or bar*/}
             <div style={{height: "10px", borderBottom: "1px solid black", textAlign: "center", borderColor: "#C1C1C1", marginBottom:"20px", marginTop:"20px"}}>
               <span style={{fontSize: "15px", backgroundColor: "#FFFFFF", padding: "0 10px"}}> or </span>
             </div>

             {/*  email input */}
             <div class="row">
               <div class="col-sm-6 col-sm-offset-3 text-center input-group-lg" style={{marginBottom:"10px"}}>
                 <input id="emaillogin" name="emaillogin" class="form-control" placeholder="Email" type="text"></input>
               </div>
             </div>

             {/*  password input */}
             <div class="row">
               <div class="col-sm-6 col-sm-offset-3 text-center input-group-lg" style={{marginBottom:"15px"}}>
                 <input id="passwordlogin" name="passwordlogin" class="form-control" placeholder="Password" type="password"></input>
               </div>
             </div>

             {/* Error html handling */}
             {this.state.errorHtml}

             {/*  Login with e-mail */}
             <div class="row">
              <div class="col-sm-6 col-sm-offset-3 text-center">
                <button type="button" class="btn btn-lg btn-block" style={this.styles.emailstyle} onClick={this.login.bind(this)} >
                  Log in
               </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
