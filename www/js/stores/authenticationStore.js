import {EventEmitter} from "events";
import dispatcher from "../dispatcher.js";
import Request from "superagent";
var Config = require('Config');

class AuthenticationStore extends EventEmitter{
  constructor(){
    super();
    this.active = 1;
    this.userDetail = {
        unverifiedUserData:null,
        loggedUserData:null
      };

    this.fromBecomeHost = false;
    this.client_id = Config.rest_client_id;
    this.client_secret = Config.rest_client_secret;
    this.styles = {
      facebookstyle: {
        fontWeight:"normal",
        color: "white",
        marginBottom: "10px",
        backgroundColor: "rgb(59, 89, 152)",
        textTransform: "none"
      },
      facebookiconstyle: {
        display: "inline-block",
        verticalAlign: "middle",
        width: "40px",
        height: "40px",
        marginBottom: "-15px",
        marginTop: "-15px",
        background: "url(../../img/fb-logo.png) 5px 50% no-repeat transparent",
        backgroundSize: "contain"
      },
      googlestyle: {
        fontWeight:"normal",
        color:"white",
        backgroundColor: "rgb(218, 72, 53)",
        textTransform: "none"
      },
      googleiconstyle: {
        display: "inline-block",
        verticalAlign: "middle",
        width: "45px",
        height: "45px",
        marginBottom: "-15px",
        marginTop: "-15px",
        background: "url(../../img/gplus-logo.png) 5px 50% no-repeat transparent",
        backgroundSize: "contain"
      },
      emailstyle: {
        fontWeight:"normal",
        color:"black",
        backgroundColor: "#C1C1C1",
        textTransform: "none"
      },
      emailiconstyle: {
        display: "inline-block",
        verticalAlign: "middle",
        width: "45px",
        height: "45px",
        marginBottom: "-15px",
        marginTop: "-15px",
        background: "url(../../img/email-logo.png) 0px 50% no-repeat transparent",
        backgroundSize: "contain"
      },
      createemailaccountstyle: {
        fontWeight:"normal",
        color:"black",
        backgroundColor: "#C1C1C1",
        textTransform: "none"
      }
    }

    this.getOwnUserDetails = this.getOwnUserDetails.bind(this);
    this.getLoggedUserData = this.getLoggedUserData.bind(this);
  };

  getOwnUserDetails(callbackSuccess)
  {
    var url = Config.restRoot + "/users/me/";
    var token = localStorage.getItem('token');
    Request
    .get(url)
    .set({'Authorization': 'Bearer '+token})
    .set({'Accept': 'application/json'})
    .end(function(err, res){
        if (res.statusCode < 300)
        {
          this.userDetail.loggedUserData = JSON.parse(res.text);
          callbackSuccess(this.userDetail.loggedUserData);
        }
        else
        {
          this.removeSession();
          this.userDetail.loggedUserData = null;
          this.emit("authChange");
        }
    }.bind(this))
  }

  getLoggedUserData(callback)
  {
    if (!this.userDetail.loggedUserData)
    {
      this.getOwnUserDetails(callback);
    }
    else {
      callback(this.userDetail.loggedUserData)
    }
  }

  getResouceDetails(resource, id, callback)
  {
    var url = Config.restRoot + "/" + resource + "/" + id + "/";
    var token = localStorage.getItem('token');
    Request
    .get(url)
    .set({'Accept': 'application/json'})
    .end(function(err, res){
        if (res.statusCode < 300)
        {
          callback(JSON.parse(res.text));
        }
        else
        {
          callback(null);
        }
    });
  }

  handleActions(action){
    switch (action.type) {
      case "UPDATEMODAL":
        this.active = action.id;
        this.emit("change");
        break;

      case "LOGIN": {
        const url = Config.restRoot + "/auth/token"
        const email = action.email;
        const password = action.password;
        const callbackError = action.callbackError;
        Request
        .post(url)
        .send({
          grant_type: "password",
          client_id: this.client_id,
          client_secret: this.client_secret,
          username: email,
          password: password
        })
        .set('Accept', 'application/json')
        .end(function(err, res){
          if(res.statusCode < 300){
            var text = JSON.parse(res.text);
            const refresh_token = text.refresh_token;
            const access_token = text.access_token;
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() + text.expires_in);
            this.setSession(access_token, expires);
            this.getOwnUserDetails(function(){
              this.emit("authChange");
            }.bind(this))
          }
          else {
            callbackError(err, res)
          }
        }.bind(this))
        break;
      }

      case "FACEBOOK_LOGIN": {
        var url = Config.restRoot + "/auth/convert-token";
        Request
        .post(url)
        .send({
          grant_type: "convert_token",
          client_id: this.client_id,
          client_secret: this.client_secret,
          backend: "facebook",
          token: action.token
        })
        .set('Accept', 'application/json')
        .end(function(err, res){
          var text = JSON.parse(res.text);
          const refresh_token = text.refresh_token;
          const access_token = text.access_token;
          const expires = new Date( (new Date().getTime() + text.expires_in) );
          this.setSession(access_token, expires);
          this.getOwnUserDetails(function(){
            this.emit("authChange");
          }.bind(this))
        }.bind(this));
        break;
      }

      case "LOGOUT": {
          var url = Config.restRoot + "/auth/invalidate-sessions";
          var token = localStorage.getItem('token');
          Request
          .post(url)
          .send({
            client_id: this.client_id
          })
          .set({'Authorization': 'Bearer '+token, 'Content-Type':'application/x-www-form-urlencoded'})
          .end(function(err, res){
              this.removeSession();
              this.userDetail.loggedUserData = null;
              this.emit("authChange");
          }.bind(this))
        break;
      }

      case "SIGNUP": {
        var email = action.email;
        var password = action.password;
        var firstName = action.firstName;
        var lastName = action.lastName;
        const callbackError = action.callbackError;
        var url = Config.restRoot + "/users/";
        var data = {email: email, password: password, first_name:firstName, last_name:lastName}
        if (!Config.sendActivationEmails){
          data['override_validation'] = null;
        }
        if(window.location.href.split("#")[1] == "/become_host"){
          this.fromBecomeHost = true;
        }
        else{
          this.fromBecomeHost = false;
        }
        Request
        .post(url)
        .send(data)
        .set('Accept', 'application/json')
        .withCredentials()
        .end(function(err, res){
            if(res.statusCode < 300){
              $('.modal-login').modal('hide');
              $('.modal-signup').modal('hide');
              var host = "";
              if(this.fromBecomeHost){
                host = "http://"+window.location.hostname+":"+window.location.port+"#/new_host"
              }
              else{
                host = "http://"+window.location.hostname+":"+window.location.port+"#/verify_email";
              }
              window.location.assign(host)
              this.userDetail.unverifiedUserData = data;
              this.emit("signUp");
            }else{
              callbackError(err, res)
            }
        }.bind(this))
        break;
      }
    }
  }

  isAuthenticated(){
    var expired = this.expiredSession();
    if ((localStorage.getItem('token') != null) && !expired) {
      return true;
    }
    return false;
  }

  isHost(){
    if (this.userDetail.loggedUserData && this.userDetail.loggedUserData.host)
      {
        return true;
      }
    else {
      return false;
    }
  }

  setSession(token, expires) {
      localStorage.setItem('token', token);
      localStorage.setItem('expires', expires);
  }

  expiredSession(){
    if(localStorage.getItem('token')){
      var dateNow = new Date().getTime();
      const dateExpires = Date.parse(localStorage.getItem('expires'));
      if(dateNow > dateExpires){
        this.removeSession;
        return true;
      }else {
        return false;
      }
    }
    else{
      return true;
    }
  }

  removeSession() {
    localStorage.removeItem('expires');
    localStorage.removeItem('token');
  }

  getStyles(){return this.styles;};

}

const authenticationStore = new AuthenticationStore;
dispatcher.register(authenticationStore.handleActions.bind(authenticationStore));

export default authenticationStore;
