import React from 'react';
import ReactDOM from 'react-dom';
import MealResult from "../components/mealResult.js";
import moment from 'moment';
import { Link } from "react-router";
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
const dummyResults = [ //TO DO Implement a set function to update this list on server results
  { price: 25, first_name: "Anada", profile_image: "./img/anada.jpg", title: "Seafood for everyone", type:"exp", photos:["./img/seafood.png"]},
  { price: 10, first_name: "Filipa", profile_image: "./img/filipa.jpg", title: "Cheese Fest", type:"exp", photos:["./img/cheese.png"]},
  { price: 5, first_name: "Maria", profile_image: "./img/maria.jpg", title: "Low-cost Francesinhas party", type:"pri", photos:["./img/francesinha.jpg"]},
  { price: 15, first_name: "Sara", profile_image: "./img/sara.jpg", title: "Brunch time", type:"pri", photos:["./img/brunch.png"]}
]

import FaFacebookOfficial from 'react-icons/lib/fa/facebook-official';
import FaTwitter from 'react-icons/lib/fa/twitter';
import FaInstagram from 'react-icons/lib/fa/instagram';

export default class Landing extends React.Component{
  constructor(){
    super();
    this.state = {
      date : moment(),
      focused: false
    }
  }


    render(){

        return(
            <div>
                <link rel="stylesheet" type="text/css" href="./css/landing.css" />
                {/*Main page*/}

                <div id="page" style={{backgroundImage:"url('../img/header%20(original).jpg')",
                                      backgroundSize:"cover"}}>
                            <div class="row" style={{
                              position: "absolute",
                              top: "0",
                              bottom: "0",
                              left: "0",
                              right: "0",
                              margin: "auto",
                              height: "0"
                              }}>
                                <div class="col-xs-offset-4 col-xs-4 text-center">
                                    <div class="row">
                                      <div class="class-xs-6" >
                                          <SingleDatePicker
                                            id="date_input"
                                            date={this.state.date}
                                            focused={this.state.focused}
                                            onDateChange={(date) =>  this.setState({date}) }
                                            onFocusChange={(focused) => this.setState(focused)}
                                            numberOfMonths={1}
                                            showDefaultInputIcon={true}
                                            displayFormat="MMMM Do,YYYY"
                                            hideKeyboardShortcutsPanel={true}
                                          />
                                      </div>
                                      <div class="class-xs-6 ">
                                        <Link to="searchmeal" class="input-lg">
                                          <div class="center-block btn btn-lg"
                                            style={{backgroundColor: "#BA0801",color: "white"}}>Pick My Meal</div>
                                        </Link>
                                      </div>
                                    </div>
                                </div>
                            </div>
                    {/*<a onClick={function(){ document.getElementById('howitworks').scrollIntoView() }} ><img id="imgScroll" class="sc1" src="./img/arrow-down-navigation.gif"/></a> */}
                </div>

                {/*How it works zone*/}
                <div id="howitworks" style={{backgroundColor: "rgb(246, 246, 246)"}}>
                    <div class="row">
                        <div class="col-md-6" style={{
                          backgroundImage: "url('../img/landing-howitworks.jpg')",
                          height: "100vh",
                          backgroundSize: "auto 100%"
                          }}/>
                        <div class="col-md-6" style={{textAlign:"center"}}>
                            <div class="row" style={{maxWidth:"550px", display:"inline-block"}}>
                                <div class="col-xs-12 text-center" style={{marginBottom:"40px"}}>
                                    <br/>
                                    <br/>
                                    <h1><b>How byMeal works?</b></h1>
                                </div>
                                <br/>
                                <br/>
                                <div class="col-xs-12" style={{marginBottom:"30px"}}>
                                    <div class="col-xs-3 text-right" style={{display: "inline-block", verticalAlign: "middle", float: "none"}}>
                                            <img src="./img/landing-search.png" style={{maxHeight:"60px"}}/>
                                    </div>
                                    <div class="col-xs-9 text-left" style={{display: "inline-block", verticalAlign: "middle", float: "none"}}>
                                        <h3><b>What do you feel like having?</b></h3>
                                        <h4>From traditional to exotic food, look it up.</h4>
                                    </div>
                                </div>
                                <div class="col-xs-12 " style={{marginBottom:"30px"}} >
                                    <div class="col-xs-9 text-right" style={{display: "inline-block", verticalAlign: "middle", float: "none"}}>
                                        <h3><b>Book it!</b></h3>
                                        <h4>Be it a private dinner with your friends or an experience with the host and other people.</h4>
                                    </div>
                                    <div class="col-xs-3" style={{display: "inline-block", verticalAlign: "middle", float: "none"}}>
                                        <img src="./img/landing-menu.png" style={{maxHeight:"60px"}}/>
                                    </div>
                                </div>
                                <div class="col-xs-12">
                                    <div class="col-xs-3 text-right" style={{display: "inline-block", verticalAlign: "middle", float: "none"}}>
                                            <img src="./img/landing-great-time.png" style={{maxHeight:"60px"}}/>
                                    </div>
                                    <div class="col-xs-9 text-left" style={{display: "inline-block", verticalAlign: "middle", float: "none"}}>
                                        <h3><b>Have a great time!</b></h3>
                                        <h4>Our goal is making the eating experience a more social and accessible one.</h4>
                                    </div>
                                </div>
                                <div class="col-xs-6 col-xs-offset-3" style={{marginTop:"100px"}}>
                                  <Link to="searchmeal">
                                    <div class="center-block btn btn-lg"
                                      style={{backgroundColor: "#BA0801",color: "white"}}>Discover now</div>
                                  </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                   <a href="#featuredMeals"><img id="imgScroll" class="sc2" src="./img/arrow-down-navigation.gif"/></a>
                </div>
                <br/>

                <div style={{backgroundColor: "rgb(246, 246, 246)"}}>
                    <div style={{textAlign: "center"}}>
                      <div style={{display:"inline-block"}}>
                        <div class="row" style={{textAlign:"left", marginLeft:"8px"}}>
                          <h2>Featured meals</h2>
                        </div>
                        <div class="row" style={{}}>
                      {
                        dummyResults.map((result, index) =>
                        <Link to="searchmeal">
                            <MealResult
                              result={result}
                              id={index.toString()}
                              key={index}/>
                          </Link>
                          )
                      }
                        </div>
                      </div>
                    </div>
                </div>
                <nav class="navbar navbar-inverse navbar-bottom" style={{backgroundColor:"rgb(210, 210, 210)", border: "0", color:"black"}}>
                        <div >
                            <div class="row">
                                <div class="col-sm-3 text-left">
                                  <h4>CONTACT US: <a style={{color:"black"}} href="mailto:info@bymeal.com">info@bymeal.com</a></h4>
                                </div>
                                <div class="col-sm-6 text-center" style={{float:"left"}}>
                                  <h4>
                                  <a style={{color:"black"}}>About</a> | <a style={{color:"black"}}>Terms of Service</a> | <a style={{color:"black"}}>Privacy Policy</a>
                                  </h4>
                                </div>
                                <div class="col-sm-3 text-right" style={{float:"left"}}>
                                  <h4>
                                  FOLLOW US:
                                  <a style={{color:"#6d84b4"}} href="http://facebook.com/bymealcom" target="_blank"><FaFacebookOfficial size={30}/></a>
                                  <a style={{color:"#4099FF"}} href="http://twitter.com/bymeal" target="_blank"><FaTwitter size={30}/></a>
                                  <a style={{color:"#e95950"}} href="http://instagram.com/bymealcom" target="_blank"><FaInstagram size={30}/></a>
                                  </h4>
                                </div>
                            </div>
                        </div>
                    </nav>

            </div>
        );

    }
}
