import dispatcher from "../dispatcher.js";

export function Query(location, meal){
  dispatcher.dispatch({
    type: "QUERY",
    searchparams: {location, meal}
  });
}
