import dispatcher from "../dispatcher.js";

export function saveInfo(id, value){
  dispatcher.dispatch({
    type: "SAVEINFO",
    id,
    value
  });
}
