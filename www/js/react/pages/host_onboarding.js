import React from "react";
import Request from "superagent"



export default class HostOnBoarding extends React.Component{
	constructor(){
		super();

        this.state = {};
	}

    componentWillMount(){
        //What type of service would you like to provide?
    }

	render(){
    return(
    <div>
      <div class="text text-center" style={{backgroundImage: "url(../../img/header.jpg)", backgroundSize:"100% 100%" }}>
        <div class="header-content" style={{paddingTop: "15%", paddingBottom: "10%"}}>
          <div class="header-content-inner">
            <h1 id="homeHeading" style={{color:"white"}}>Become a ByMEAL Host</h1>
            <div id="custom-search-input">
              
            </div>
          </div>
        </div>
      </div>


               <div class="row text-center" >
                <div class="input-group col-md-12">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-md-12 col-sm-12 col-xs-12 input-group">
                        <div class="form-group">
                                      <label><input id="checkboxAgree" type="checkbox"/> <span style={{position: "absolute", top:"3px"}}>I have read and agree with ByMeal's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
       
	)
	}
}
