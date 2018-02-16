import React from "react";
import AuthenticationStore from "../../stores/authenticationStore.js";
import Geosuggest from 'react-geosuggest';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import {Gmaps, Marker, Circle} from 'react-gmaps';
import * as HAct from "../../actions/hostActions";
import HStr from "../../stores/hostStore.js";
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import {RadioGroup, Radio} from 'react-radio-group';
import UserGalleryUploader from "../components/userGalleryUploader.js";
import update from 'react-addons-update';
import "../../../css/geosuggest.css"
import FaAsterisk from 'react-icons/lib/fa/asterisk';

export default class BHost extends React.Component{
  constructor(){
    super();
    this.authenticated = this.authenticated.bind(this);
    this.getEntryHtml = this.getEntryHtml.bind(this);
    this.getExistingUserFormSubmitHtml = this.getExistingUserFormSubmitHtml.bind(this);
    this.getNewUserFormSubmitHtml = this.getNewUserFormSubmitHtml.bind(this);

    this.invalidFieldStyle = {backgroundColor: "rgba(255, 0, 0, 0.3)"};

    this.state = {
      authenticated: false,
      mapData: "",
      images: "",
      stage: null,
      validationHtml: { },
      errorMessage: "",

      otherLocation: "",
      otherAmenities: "",

      features: "",
      description : "",
      serviceType : "",
      joiningReason : "",
      frequencyType : "",
      mealType : [],
      lat : "",
      lon : "",
      amenities : [],
      amenitiesExtra: [],
      venueType : "",
      venuePhotos: [],
      instructions: ""
    };

    this.minimumRequeriments = {
      description : 60,
      instructions : 5,
      venuePhotos:0
    }
  }



  addressEntered(suggest){
    this.setState({mapData:
      <Gmaps
        width={'100%'}
        height={'300px'}
        lat={suggest.location.lat}
        lng={suggest.location.lng}
        zoom={17}
        loadingMessage={'Loading map...'}
        params={{v: '3.exp', key: 'AIzaSyDTm73KUiiVgqgizfkY24TvGA_BxDIOkvs'}}>
        <Marker lat={suggest.location.lat} lng={suggest.location.lng} draggable={false} />
        <Circle lat={suggest.location.lat} lng={suggest.location.lng} radius={100} fillColor={"green"} strokeWeight={1} clickable={false} strokeColor={"green"} />
      </Gmaps>
    });

    this.setState({"lat": suggest.location.lat, "lon": suggest.location.lng})
  }

  getAnnouncementIcon(icon){
    return (<span class={"form-control-feedback glyphicon " + icon} style={{position:"absolute", top:"5px", zIndex:"3"}}></span>);
  }

  setUserDataAndStage(userData){
    this.setState({
      firstName:userData.first_name,
      lastName:userData.last_name,
      email:userData.email
    });
    if (!AuthenticationStore.isHost())
    {
      this.setState({stage:"Entry"});
    }
    else {
      this.setState({stage:"AlreadyHost"});
    }
  }

  componentWillMount() {
    if (!AuthenticationStore.isAuthenticated())
    {
      if (!AuthenticationStore.userDetail.unverifiedUserData)
      window.location.assign("http://"+window.location.hostname+":"+window.location.port+"#/become_host");
      else
      {
        this.setState({
          firstName:AuthenticationStore.userDetail.unverifiedUserData.first_name,
          lastName:AuthenticationStore.userDetail.unverifiedUserData.last_name,
          email:AuthenticationStore.userDetail.unverifiedUserData.email
        })
        this.setState({stage:"Entry"});
      }
    }
    else
    {
      if (!AuthenticationStore.userDetail.loggedUserData)
      {
        AuthenticationStore.getLoggedUserData(
          function(data){
            this.setUserDataAndStage(data)
          }.bind(this)
        )
      }
      else {
        this.setUserDataAndStage(AuthenticationStore.userDetail.loggedUserData)
      }
    }
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

  validateFields()
  {
    const conditions = {
      description: this.state.description.length < this.minimumRequeriments.description,
      joiningReason: this.state.joiningReason == "",
      serviceType: this.state.serviceType == "",
      frequency: this.state.frequencyType == "",
      mealType: this.state.mealType.length == 0,
      map: this.state.lat == "",
      amenities: this.state.amenities.length == 0,
      venueType: this.state.venueType == "",
      venuePhotos: this.state.venuePhotos.length < this.minimumRequeriments.venuePhotos,
      instructions: this.state.instructions.length < this.minimumRequeriments.instructions
    }

    this.setState(update(this.state,
      {validationHtml: {
        description: {$set: conditions.description ? this.invalidFieldStyle : {} },
        joiningReason: {$set: conditions.joiningReason ? this.invalidFieldStyle : {} },
        serviceType: {$set: conditions.serviceType ? this.invalidFieldStyle : {} },
        frequencyType: {$set: conditions.frequency ? this.invalidFieldStyle : {} },
        mealType: {$set: conditions.mealType ? this.invalidFieldStyle : {} },
        map: {$set: conditions.map ? this.invalidFieldStyle : {} },
        amenities: {$set: conditions.amenities ? this.invalidFieldStyle : {} },
        venueType: {$set: conditions.venueType ? this.invalidFieldStyle : {} },
        venuePhotos: {$set: conditions.venuePhotos ? this.invalidFieldStyle : {} },
        instructions: {$set: conditions.instructions ? this.invalidFieldStyle : {} }
      }}
    ));

    for(var o in conditions)
    if(conditions[o]) {return false;}
    return true;


  }

  verifyAndRedirect(){
    if (this.validateFields())
    {
      HAct.onboard(this.state.email,
        this.state.description,
        this.state.features,
        this.state.instructions,
        this.state.serviceType,
        this.state.joiningReason,
        this.state.frequencyType,
        this.state.mealType,
        this.state.lat,
        this.state.lon,
        this.state.amenities.concat(this.state.amenitiesExtra).filter(function(val){return val != "other" && val != ""}), //Adds other amenities, then filters out the empty string and other option
        this.state.venueType,
        this.state.venuePhotos);
        if(!AuthenticationStore.isAuthenticated())
        {
          this.setState({stage:"NewUserFormSubmit"})
        }
        else
        {
          this.setState({stage:"ExistingUserFormSubmit"})
        }
      }
      else
      {
        this.setState({errorHtml:
          <div class="row" style={{backgroundColor:"#F88379", marginBottom:"10px"}}>
            <div class="col-sm-1 col-xs-2">
              <img src="./img/exclamation-mark.png" width="35px" height="35px"/>
            </div>
            <div class="col-sm-11 text-left " style={{color:"rgb(88, 85, 85"}}>
              Please correct the fields marked in red and retry.
            </div>
          </div>
        })
      }
    }

    handleLocationSelection(value){
      if(value != undefined){
        if(value == "other"){
          this.setState({otherLocation:   <input class="form-control"
              placeholder="Please specify other venue"
              style={{width: "50%"}}
              onChange={function(e){this.setState({venueType: "other:" +  e.target.value})}.bind(this)}></input>})
        }
        else{
          this.setState({otherLocation: <a/>})
          this.setState({venueType:value})
        }
      }
    }

    handleAmenitiesSelection(value){
      this.setState({amenities:value})
      if(value.indexOf("other") > -1){
        this.setState({otherAmenities:   <textarea class="form-control"
            placeholder="Please specify other amenities, separated by a comma (,)"
            rows="5"
            style={{width: "75%"}}
            onChange={function(e){this.setState({amenitiesExtra: e.target.value.split(",")})}.bind(this)}
            ></textarea>})
      }
      else{
        this.setState({otherAmenities: <a/>})
      }
    }

    getExistingUserFormSubmitHtml()
    {
      return(
        <div class="container" id="public-profile">
          <h2 class="text-center">You&#39;re done!</h2>

          <br/>
          <div class="row">
            <h3>
              Thank you for joining our Hosts&#39; community {this.state.firstName}, we wish you a great time!
            </h3>
            <br/><br/>
            <h4> Hit the kitchen, start posting meals now! </h4>
            <a data-toggle="modal" data-target=".modal-postmeal" class="btn btn-primary btn-xl page-scroll">Post a meal</a>

          </div>
        </div>
      );
    }

    getNewUserFormSubmitHtml()
    {
      return(
        <div class="container" id="public-profile">
          <h2 class="text-center">Almost done!</h2>

          <br/>
          <div class="row">
            <h3>
              Thank you for joining our Hosts&#39; community {this.state.firstName}, we wish you a great time!
            </h3>
            <br/><br/>
            <h4> To complete your registration on our platform, please activate your account by following the link sent to your email.
            </h4>

          </div>
        </div>
      );
    }

    getAlreadyHostEntryHtml()
    {
      return(
        <div class="container" id="public-profile">
          <h2 class="text-center">You&#39;re already a host {this.state.firstName}!</h2>
          <br/>
          <div class="row">

            <h4>Humm, it appears you&#39;re already a host! Hit the kitchen, start posting meals now! </h4>
            <a data-toggle="modal" data-target=".modal-postmeal" class="btn btn-primary btn-xl page-scroll">Post a meal</a>

          </div>
        </div>
      );
    }

    getEntryHtml()
    {
      const labelStyle={color:"rgb(181, 109, 55)"};
      return(
        <div>
          <div>
            <div class="container" id="public-profile">
              <h2 class="text-center">Public profile</h2>

              <br/>
              <div class="row">
                <div class="col-md-3 col-md-offset-3 text-left">
                  <label for="firstName">First Name*:</label>
                  <input class="form-control" value={this.state.firstName} placeholder="First Name"/>
                </div>
                <div class="col-md-3 text-left">
                  <label for="lasttName" class="text-left">Last Name*:</label>
                  <input class="form-control" value={this.state.lastName} placeholder="Last Name"/>
                </div>
              </div>
              <div class="row col-md-6 col-md-offset-3 text-left">
                <small><FaAsterisk style={{color:"#CCCC5C"}}/> <span style={{color:"gray"}}><em>Only your first name will be visible to others.</em></span></small>
              </div>
              <br/>
              <div class="row">
                <div class="col-md-6 col-md-offset-3 text-left">
                  <label class="text-uppercase"  style={labelStyle} for="description">Description: <span class="small"> <em>(Minimum {this.minimumRequeriments.description} characters )</em> </span></label>
                  <textarea rows="5"
                    class="form-control"
                    value={this.state.description}
                    onChange={function(e){ this.setState({description:e.target.value}) }.bind(this) }
                    placeholder="Describe yourself"
                    style={{resize:"none", ...this.state.validationHtml.description}}/>
                </div>
              </div>
              <br/>
              <div class="row">
                {/*
                <div class="col-md-3 col-md-offset-3 text-center">
                  <label class="text-left">Profile Photo</label>
                  <br/>
                  <div class ="row">
                    <div class="thumbnail col-md-8 text-center" style={{
                        display:"inline-block",
                        height:"60px",
                        width:"60px",
                        overflow:"hidden",
                        borderRadius:"50%",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundImage: "url(./img/person1.jpg)",
                        marginLeft:"15px"
                      }}></div>
                      <div class="col-md-4 text-center">
                        <a class="btn btn-primary" style={{marginLeft: "10px"}}>Upload</a>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3 text-left">
                    <label for="location" >Where are you located?*</label>
                    <input type="text" class="form-control" id="location" placeholder="Porto, Portugal"/>
                  </div>
                  */}


                </div>
              </div>

            </div>
            <br/>
            <div class="container" id="venue" style={{marginBottom:"15px"}}>
              <h2 class="text-center">Your Venue</h2>
              <div class="row">
                <div class="col-md-6 col-md-offset-3 text-left">
                  <label class="text-uppercase"  style={labelStyle}>Whats your address:</label><br/>
                  <small><FaAsterisk style={{color:"#CCCC5C"}}/> <span style={{color:"gray"}}><em>We&#39;ll only disclose your address after a guest is confirmed and payment is done in advance. In the meantime we only show an approximate location.</em></span></small>
                  <Geosuggest placeholder="Start typing your full address" country="PT" onSuggestSelect={this.addressEntered.bind(this)} style={{'input': this.state.validationHtml.map }}/>
                  <CSSTransitionGroup           transitionName="showVenueMap"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.mapData}
                  </CSSTransitionGroup>

                </div>

                <div class="col-md-6 col-md-offset-3 text-left">
                  <br/>
                  <label class="text-uppercase" style={labelStyle}>Arrival instructions <span class="small"> <em>(Minimum {this.minimumRequeriments.instructions} characters )</em> </span></label>
                  <input class="form-control"
                    onChange={function(instructions){ this.setState({instructions:instructions.target.value}) }.bind(this)}
                    placeholder="Ex: Ring doorbell 3A"
                    style={this.state.validationHtml.instructions}></input>
                  <br/>

                  <label class="text-uppercase" style = {labelStyle}>Special <u>feature</u> about your place that's worth sharing</label>
                  <textarea class="form-control"
                    rows="5"
                    placeholder="Awesome Rooftop? Cosy Backyard? A jukebox?"
                    onChange={function(e){this.setState({features: e.target.value})}.bind(this)}
                  ></textarea>

                  <br/>
                  <label class="text-uppercase"  style={labelStyle}>Upload some photos of your venue <small><em>(max 6)</em></small></label>
                  <UserGalleryUploader
                    maxFiles={6}
                    folderName={"venues"}
                    style={this.state.validationHtml.venuePhotos}
                    onChange={function(e){this.setState({venuePhotos:e})}.bind(this)}/>



                  <br/>
                  <label class="text-uppercase"  style={labelStyle}>Where do you plan on hosting?</label>
                  <RadioGroup name="venueType"
                    onClick={ (val)=>this.handleLocationSelection(val.target.value) /*function(type){ this.setState({venueType:type}) }.bind(this)*/}
                    style={{textAlign: "justify", margin: "0 auto", width: "30em", ...this.state.validationHtml.venueType}}>
                    <Radio value="dinRoom"/>Dining Room <br/>
                    <Radio value="kitchen"/>Kitchen <br/>
                    <Radio value="backyard"/>Backyard <br/>
                    <Radio value="terrace"/>Terrace <br/>
                    <Radio value="other" />Other
                    </RadioGroup>
                    <CSSTransitionGroup           transitionName="showInputOtherLocation"
                      transitionEnterTimeout={500}
                      transitionLeaveTimeout={300}>
                      {this.state.otherLocation}
                    </CSSTransitionGroup>
                    <br/>
                    <label class="text-uppercase"  style={labelStyle}>Amenities</label>
                    <CheckboxGroup
                      name="amenities"
                      value={this.state.amenities}
                      onChange={ (e)=>this.handleAmenitiesSelection(e)/* function(amenity){ this.setState({amenities:amenity}) }.bind(this)*/}
                      style={{textAlign: "justify", margin: "0 auto", width: "30em", ...this.state.validationHtml.amenities}}>
                      <Checkbox value="petFriendly"/>Pet Friendly<br/>
                      <Checkbox value="easyTransport"/>Easily reached by public transportation<br/>
                      <Checkbox value="freePark"/>Free street parking<br/>
                      <Checkbox value="allowSmoking"/>Smoke Allowed<br/>
                      <Checkbox value="wifi"/>Wifi Available<br/>
                      <Checkbox value="other"/>Other
                      </CheckboxGroup>
                      <CSSTransitionGroup           transitionName="showInputOtherAmenities"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {this.state.otherAmenities}
                      </CSSTransitionGroup>
                      <br/>

                    </div>

                  </div>
                </div>


                <div class="container" id="public-questionnaire">
                  <h2 class="text-center">Just a few more questions to get to know you better</h2>
                  <div>
                    <h3>What type of service would you like to provide?</h3>
                    <RadioGroup name="serviceType"
                      onChange={function(type){ this.setState({serviceType:type}) }.bind(this)}
                      style={{textAlign: "justify", margin: "0 auto", width: "30em", ...this.state.validationHtml.serviceType}}>
                      <Radio value="experience" />Experience – Join your guests<br/>
                      <Radio value="private" />Private Dining – Cook for your guests<br/>
                      <Radio value="both" />Both
                      </RadioGroup>

                      <br/>
                      <h3>Why do you want to join ByMEAL?</h3>
                      <RadioGroup name="joiningReason"
                        onChange={function(reason){ this.setState({joiningReason:reason}) }.bind(this)}
                        style={{textAlign: "justify", margin: "0 auto", width: "30em", ...this.state.validationHtml.joiningReason}}>
                        <Radio value="income" />Make an extra income<br/>
                        <Radio value="meet" />Meet new people <br/>
                        <Radio value="test" />Test new recipes
                        </RadioGroup>
                        <br/>

                        <h3>How often do you plan to host?</h3>
                        <RadioGroup name="frequency"
                          onChange={function(frequency){ this.setState({frequencyType:frequency}) }.bind(this)}
                          style={{textAlign: "justify", margin: "0 auto", width: "30em", ...this.state.validationHtml.frequencyType}}>
                          <Radio value="weekly" />Once a week or more<br/>
                          <Radio value="biweekly" />Once every other week<br/>
                          <Radio value="monthly" />Once a month or less
                          </RadioGroup>

                          <h3>What type of cuisine do you plan to cook?</h3>
                          <CheckboxGroup
                            name="mealType"
                            value={this.state.mealType}
                            onChange={function(newTypes){ this.setState({mealType:newTypes}) }.bind(this)}
                            style={{textAlign: "justify", margin: "0 auto", width: "30em", ...this.state.validationHtml.mealType}}>

                            <Checkbox value="local"/> Local<br/>
                            <Checkbox value="mediterranean"/> Mediterranean<br/>
                            <Checkbox value="italian"/> Italian<br/>
                            <Checkbox value="japanese"/> Japanese<br/>
                            <Checkbox value="asian"/> Asian (Thai / Chinese / Vietnamese)<br/>
                            <Checkbox value="vegan"/> Vegan<br/>
                            <Checkbox value="other"/> Other

                            </CheckboxGroup>
                            <br/>
                            <div class="row">
                              <div class="col-md-6 col-md-offset-3">
                                {this.state.errorHtml}
                                <div onClick={() => this.verifyAndRedirect()} class="center-block btn btn-lg btn-primary">Submit</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>




                    );
                  }

                  render(){
                    let html;
                    switch (this.state.stage) {
                      case "Entry":
                      html = this.getEntryHtml();
                      break;
                      case "AlreadyHost":
                      html = this.getAlreadyHostEntryHtml();
                      break;
                      case "ExistingUserFormSubmit":
                      html = this.getExistingUserFormSubmitHtml();
                      break;
                      case "NewUserFormSubmit":
                      html = this.getNewUserFormSubmitHtml();
                      break;
                    }
                    return(
                      <div>
                        <h1 style={{
                            backgroundImage: "url(./img/new-host-header.jpg)",
                            marginTop:"50px",
                            color:"white",
                            padding: "60px 0 60px 0",
                            backgroundPosition: "center",
                            maxHeight: "160px",
                            zIndex: "10"

                          }} class="text-center navbar-fixed-top">
                          <b>Become a ByMEAL host</b>
                        </h1>

                        <section class="text-center" style={{marginTop:"120px"}}>
                          {html}
                        </section>
                      </div>
                    )
                  }
                }
