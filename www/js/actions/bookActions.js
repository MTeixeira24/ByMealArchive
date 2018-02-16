import dispatcher from "../dispatcher.js";

export function makeBookRequest(data, mealId,callbackSuccess, callbackError){
  dispatcher.dispatch({
    type: "MAKE_BOOK_REQUEST",
    data,
    mealId,
    callbackSuccess,
    callbackError
  })
}

export function pay(cardToken, requestId){
  dispatcher.dispatch({
    type: "PAY",
    cardToken,
    requestId
  })
}

export function loadGuestMeals(callbackSuccess, callbackError){
  dispatcher.dispatch({
    type: "GUEST_MEALS",
    callbackSuccess,
    callbackError
  })
}
