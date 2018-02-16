import React from "react";
import * as AAct from "../../actions/authenticationActions";
import AStr from "../../stores/authenticationStore";

export default class signup extends React.Component{
  constructor(){
    super();
    this.state={
      passwordCheck: 0,
      class:"",
      announcementHtml: {password:"",email:"", firstName:"", lastName:""},
      loginstage:"socialnets",
      errorHtml:""
    }
    this.styles = AStr.getStyles();
    this.sendSignupInfo = this.sendSignupInfo.bind(this);
  }

  facebookLogin(e){
    this.props.login();
  }

  signupErrorCallback(err, res) {
    const errors = JSON.parse(res.text);
    const emailIsInErrors = Object.keys(errors).indexOf("email") > -1;

    var errormsg = ""
    if (emailIsInErrors == true)
    {
      errormsg = "We're sorry but that user is already taken. Please select a different e-mail."
      this.state.announcementHtml.email = this.getAnnouncementIcon("glyphicon-alert")
    }
    else
    {
      var errormsg = ["Please correct the following errors:"]
        for (var key in errors){
            if (key == "first_name")
            {
              errormsg.push(<div><li><b>First name </b>: {errors[key]}</li></div>)
              this.state.announcementHtml.firstName = this.getAnnouncementIcon("glyphicon-alert")
            }
            else if (key == "last_name")
            {
              errormsg.push(<div><li><b>Last name </b>: {errors[key]}</li></div>)
              this.state.announcementHtml.lastName = this.getAnnouncementIcon("glyphicon-alert")
            }
        }
    }

    this.setState({errorHtml:
       <div class="row" style={{backgroundColor:"#F88379", marginBottom:"10px"}}>
        <div class="col-sm-1 col-xs-2">
          <img src="./img/exclamation-mark.png" width="35px" height="35px"/>
        </div>
        <div class="col-sm-11 text-left " style={{color:"rgb(88, 85, 85"}}>
          {errormsg}
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
         auth2.attachClickHandler(document.getElementById('googleSignup'), {},
             function(googleUser) {
               document.getElementById('name').innerText = "Signed in: " +
                   googleUser.getBasicProfile().getName();
             }, function(error) {
               //alert(JSON.stringify(error, undefined, 2));
             });
       });
    }

  getAnnouncementIcon(icon){
    return (<span class={"form-control-feedback glyphicon " + icon} style={{position:"absolute", top:"5px", zIndex:"3"}}></span>);
  }

    checkPassword(e){
      var pwd = document.getElementById('passwordsignup').value;
      var rpwd = document.getElementById('repeatpasswordsignup').value;
      if(rpwd == ""){
        this.setState({passwordCheck:0});
        this.setState({class:""});
        this.state.announcementHtml.password = "";
      }
      else{
        if(pwd == rpwd){
          this.setState({passwordCheck:1});
          this.setState({class:" has-success"});
          this.state.announcementHtml.password = this.getAnnouncementIcon("glyphicon-ok")
        }
        else{
          this.setState({passwordCheck:2});
          this.setState({class:" has-error"});
          this.state.announcementHtml.password = this.getAnnouncementIcon("glyphicon-remove")
        }
      }
    }

    sendSignupInfo(){
      //Send the sign up information to server
      //Reminder to either force https or encrypt this information before sending
      const firstName = document.getElementById("firstnamesignup").value;
      const lastName = document.getElementById("lastnamesignup").value;
      const email = document.getElementById("emailsignup").value;
      const password = document.getElementById("passwordsignup").value;

      if((this.state.class == " has-success")){
        this.state.announcementHtml.email = "";
        this.state.announcementHtml.firstName = "";
        this.state.announcementHtml.lastName = "";
        this.state.announcementHtml.password = "";
        AAct.sign_up(email, password, firstName, lastName, this.signupErrorCallback.bind(this));
      }
      else{
          console.log("Error, non matching passwords")//Add error handling to remind the user of non matching passwords
      }
    }

    swapstage(){
      this.state.announcementHtml.email = "";
      this.state.announcementHtml.firstName = "";
      this.state.announcementHtml.lastName = "";
      this.state.errorHtml = "";
      if (this.state.loginstage == "socialnets")
      {
        this.setState({loginstage:"normal"});
      }
      else
      {
        this.setState({loginstage:"socialnets"});
      }
    }

    getHtml() {
      if (this.state.loginstage == "socialnets" )
      {
      return (
              <div>
                 <h1 class="text-center">Sign-up</h1>
                 <div class="theme-selector"></div>

                 {/*  Already have an account button */}
                 <div class="text-center" style={{color: "#C1C1C1"}}>Already have an account?
                   <a class="page-scroll"
                     data-toggle="modal"
                     data-target=".modal-login"
                     onClick={function(){$('.modal-signup').modal('toggle')}}>
                     Login!</a>
                   </div>

                 {/*  Facebook button */}
                 <div class="row">
                   <div class="col-sm-6 col-sm-offset-3 text-center">
                     <button  style={this.styles.facebookstyle} type="button" class="btn btn-block btn-lg" onClick={this.facebookLogin.bind(this)}>
                           <span style={this.styles.facebookiconstyle}></span>Sign up with facebook
                     </button>
                   </div>
                 </div>

                 {/*  Google button */}
                <div class="row">
                 <div class="col-sm-6 col-sm-offset-3 text-center">
                   <button id="googleSignup" style={this.styles.googlestyle} type="button" class="btn btn-block btn-lg">
                    <span style={this.styles.googleiconstyle}></span>Sign up with google
                   </button>
                   </div>
                 </div>


                 <div id="name"></div>
                 <hr style={{maxWidth: "400px", borderColor: "#C1C1C1", borderWidth: "1px"}}/>

                 {/*  Signup with e-mail */}
                <div class="row">
                 <div class="col-sm-6 col-sm-offset-3 text-center">
                   <button type="button" class="btn btn-lg btn-block" style={this.styles.emailstyle} onClick={this.swapstage.bind(this)} >
                      <span style={this.styles.emailiconstyle}></span>Sign up with E-mail
                   </button>
                   </div>
                 </div>

                {/*  Agreement */}
                 <div class="row" style={{marginTop:"20px"}}>
                  <div class="col-sm-8 col-sm-offset-2 text-center">
                  By creating an account, you confirm that you accept our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                  </div>
                 </div>
                </div>
        );
    }
    else
    {
            return (
          <form class>
            {this.state.errorHtml}


            <div class="input-group input-group-lg" style={{ width:"100%"}}>
              <input id="firstnamesignup" name="firstnamesignup" class="form-control" placeholder="First Name" type="text"></input>{this.state.announcementHtml.firstName}
            </div>
            <div class="input-group input-group-lg" style={{marginTop:"10px", width:"100%"}}>
              <input id="lastnamesignup" name="lastnamesignup" class="form-control" placeholder="Last Name" type="text"></input>{this.state.announcementHtml.lastName}
            </div>

            <div class="input-group input-group-lg" style={{marginTop:"10px", width:"100%"}}>
              <input id="emailsignup" name="emailsignup" class="form-control" placeholder="Email" type="text"></input>{this.state.announcementHtml.email}
            </div>
            <div class="input-group input-group-lg" style={{marginTop:"10px", width:"100%"}}>
              <input id="passwordsignup" name="passwordsignup" class="form-control" placeholder="Password" type="password"></input>
            </div>

            <div class={"form-group has-feedback" + this.state.class} >
              <div class="input-group input-group-lg" style={{marginTop:"10px", width:"100%"}}>
                <input class="form-control" id="repeatpasswordsignup" placeholder="Repeat Password" type="password" onChange={this.checkPassword.bind(this)}/>{this.state.announcementHtml.password}
              </div>
            </div>

          <div class="row">
           <div class="col-sm-3 text-left">
             <img src="./img/back-arrow.png" width="45px" height="45px" onClick={this.swapstage.bind(this)}/>

             </div>
           <div class="col-sm-6  text-center">
             <button type="button" class="btn btn-lg btn-block" style={this.styles.createemailaccountstyle} onClick={this.sendSignupInfo.bind(this)} >
                Create Account
             </button>
             </div>
           </div>



          </form>

        );
    }

    }

  render(){
    return (
      <div class="modal fade modal-signup" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
        <div class="modal-dialog modal-lg">
           <div class="modal-content">
              <div class="modal-body">
                { this.getHtml() }
              </div>
            </div>
          </div>
        </div>
        );
  }
}
