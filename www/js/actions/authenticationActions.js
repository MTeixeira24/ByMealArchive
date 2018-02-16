import dispatcher from "../dispatcher.js";


export function login(email, password, callbackError){
  dispatcher.dispatch({
    type: "LOGIN",
    email: email,
    password: password,
    callbackError: callbackError
  })
}

export function facebookAuth(token){
  dispatcher.dispatch({
    type: "FACEBOOK_LOGIN",
    token
  });
}

export function storeFacebookToken(token){
  dispatcher.dispatch({
    type: "FACEBOOK_TOKEN",
    token
  })
}

export function sign_up(email, password, firstName, lastName, callbackError){
  dispatcher.dispatch({
    type: "SIGNUP",
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    callbackError: callbackError
  })
}

export function invalidate_token(){
  dispatcher.dispatch({
    type: "LOGOUT"
  })
}

export function switchModal(id){
  dispatcher.dispatch({
    type: "UPDATEMODAL",
    id,
  });
}
