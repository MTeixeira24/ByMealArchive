import React from "react";
import ReactDOM from "react-dom";
import Contact from "../contact.js";
import AuthenticationStore from "../../stores/authenticationStore.js";
export default class BHost extends React.Component{
	constructor(){
		super();
		this.authenticated = this.authenticated.bind(this);
        this.state = {
          authenticated: false
        };
		this.becomeHostFlow = this.becomeHostFlow.bind(this);

	}

    componentWillMount() {
        const script = document.createElement("script");

        script.src = "./js/b-host-nav-btn-show.js";
        document.body.appendChild(script);

		this.setState({authenticated: AuthenticationStore.isAuthenticated()});
    }

	componentDidMount(){
	    AuthenticationStore.on("authChange", this.authenticated);
	}

    componentWillUnmount(){
	    AuthenticationStore.removeListener("authChange", this.authenticated);
	}

	authenticated(){
	    this.setState({authenticated: AuthenticationStore.isAuthenticated()});
	}

	becomeHostFlow(){
		if(this.state.authenticated){
			window.location.assign("http://"+window.location.hostname+":"+window.location.port+"#/new_host");
		}
		else{
			$('.modal-signup').modal('show');
		}
	}

	render(){
	return (
		<div>
            <link rel="stylesheet" type="text/css" href="./css/bhost.css" />
            <div id="hiw" class="hiw1">
            <div class="center-block">
                <div class="title center-block">Have you got an empty chair?<br/>
                    <h2>Make an extra income. Create a great experience</h2>
                </div>
                <div class="center-block btn btn-lg" onClick={() => this.becomeHostFlow()}>Become a Host</div>
        </div>
    </div>

    <div id="hiw" class="hiw2">
        <div class="row">
            <div class="col-xs-12">
                <div class="col-xs-8"><br/>
                    “As someone who has been living in Porto for some time now, I have always felt the need to introduce people, to the
tastes of my country. I could only do it within my circle of friends, until I started to use ByMeal, where I get to cook to
every kind of people and make friends along the way.”<br/>
                <p>Anada, Porto</p>
                    </div>
                <div class="thumbnail col-xs-push-1 col-xs-2"><img src="./img/person1.jpg"/></div>
            </div>
            <div class="col-xs-12 ">
                <div class="thumbnail col-xs-2"><img src="./img/person2.jpg"/></div>
                          <div class="col-xs-push-1 col-xs-8"><br/>
                    “I love cooking for other people. Apart from friends and family, it’s not easy to cook for people through the conventional channels.
										byMeal offers a new way of connecting to new people. Besides this, I also realized this was a great way to make use of my space, by preparing every kind of events and make money even when I´m out of the house!”
                                <p>Maria, Porto</p>

                              </div>
            </div>
            <div class="col-xs-12">
                    <div class="col-xs-8"><br/>
                    “People love Brazilian food! Nothing new about that! But, I finally started to use the flavours of Brazil, to generate an
extra income. People from all over the word come to Porto, so all of this,
makes every meal I have, an exciting experience! I even teach how to make some of my delicious recipes!”
                            <p>Sara, Porto</p>
                                    </div>
                <div class="thumbnail col-xs-push-1 col-xs-2"><img src="./img/person3.jpg"/></div>

            </div>
        </div>


    </div>
    <div id="hiw" class="hiw3">
        <h2>Find out more...</h2>
        <div class="row">
            <div class="col-md-4">
                <div class="col-xs-3">
                    <img src="img/signup-icon.png"/>
                </div>
                <div class="col-xs-9">
                    <h4>Sign up</h4>
                    <p>Click on “Become a host”. In minutes, you can setup your host profile and post a meal. </p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="col-xs-3">
                    <img src="img/calendar-icon.png"/>
                </div>
                <div class="col-xs-9">
                    <h4>Post a meal</h4>
                    <p>Now that you have become a host, you can create an event! Select the type of meal, price, number of guests, date, etc.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="col-xs-3">
                    <img src="img/payment.png"/>
                </div>
                <div class="col-xs-9">
                    <h4>Payment</h4>
                    <p>We make things simple and safe. The payment goes through us. This means the customer pays before arriving to your place.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="col-xs-3">
                    <img src="img/fee.png"/>
                </div>
                <div class="col-xs-9">
                    <h4>Service fee</h4>
                    <p>For all our services, we charge a 3% service fee on each reservation you get.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="col-xs-3">
                    <img src="img/protection.png"/>
                </div>
                <div class="col-xs-9">
                    <h4>Protection</h4>
                    <p>Our insurance aims to protect you from damages. </p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="col-xs-3">
                    <img src="img/here-to-help.png"/>
                </div>
                <div class="col-xs-9">
                    <h4>We are here to help</h4>
                    <p>The perfect title, the best description or a fair price, contact us if you need help!<br/><a href="mailto:info@bymeal.com">info@bymeal.com</a></p>
                </div>
            </div>
            <div class="col-md-4 hf">
                <div class="col-xs-3">
                    <img src="img/have-fun.png"/>
                </div>
                <div class="col-xs-9">
                    <h4>Have fun!</h4>
                    <p>We want you to get into the ByMeal spirit, providing your guests with the best experience possible, without forgetting to also have a good one! </p>
                </div>
            </div>
            <div class="col-md-4"></div>

    </div>
    </div>
 		<Contact/>

		</div>
	);
	}
}
