import React from "react";
import Header from "../header.js"
import Contact from "../contact.js";
import Body from "../body.js";

export default class Home extends React.Component{
  constructor(){
    super();
  }

  render(){
    return(
      <div>
        <Header/>
        <Body/>
        <Contact/>
      </div>
    );
  }
}
