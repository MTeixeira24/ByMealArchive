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
import "../../../css/geosuggest.css";
import Modal from 'react-modal';
import FaAsterisk from 'react-icons/lib/fa/asterisk';
import { withRouter } from 'react-router';


export default class VPrefs extends React.Component{
  constructor(){
    super();
    this.invalidFieldStyle = {backgroundColor: "rgba(255, 0, 0, 0.3)"};
    this.authenticated = this.authenticated.bind(this);
    this.renderResponse = this.renderResponse.bind(this);
    this.state = {
      authenticated: false,
      id: -1,
      hostid: -1,
      amenities: [],
      arrival_instructions: "",
      lat: "",
      lon: "",
      venue_type: "",
      venuePhotos: [],
      description: "",
      validationHtml: { },
      modalOpen: false,
      modalHtml: { },
    };
    this.serverInformation = { };
    this.minimumRequeriments = {
      description : 60,
      instructions : 5,
      venuePhotos:0
    };

    this.venueConversion = {
      "DINING_ROOM":"dinRoom",
      "KITCHEN" : "kitchen",
      "BACKYARD" : "backyard",
      "TERRACE" : "terrace",
      "OTHER" : "other"
    };

    this.amenitiesConversion = {
      "PET_FRIENDLY" : "petFriendly",
      "PUBLIC_TRANSPORTATION" : "easyTransport",
      "FREE_PARKING" : "freePark",
      "SMOKING" : "allowSmoking",
      "WIFI" : "wifi",
      "OTHER" : "other"
    };

    this.setVenueInfo = this.setVenueInfo.bind(this);
  }
  componentWillMount() {
    this.setState({authenticated: AuthenticationStore.isAuthenticated()});
    AuthenticationStore.getLoggedUserData(
      function(data){ this.setVenueInfo(data.host.venue, data.host.description); this.setState({hostid: data.host.id}); }.bind(this)
    );
    window.onbeforeunload = function (e) {
      if(this.unsavedChanges())
        return e;
    }.bind(this);
  }

  componentDidMount(){
    AuthenticationStore.on("authChange", this.authenticated);
    this.props.router.setRouteLeaveHook(this.props.route, () => {
        if(this.unsavedChanges()){
          return 'There is unsaved information, are you sure you want to leave this page?'
        }
    })
  }

  unsavedChanges(){
    for (var k in this.serverInformation) {
        if (this.serverInformation.hasOwnProperty(k)) {
            if(JSON.stringify(this.state[k])!=JSON.stringify(this.serverInformation[k]))
              return true;
        }
    }
    return false;
  }

  componentWillUnmount(){
    AuthenticationStore.removeListener("authChange", this.authenticated);
    window.onbeforeunload = null;
  }

  authenticated(){
    this.setState({authenticated: AuthenticationStore.isAuthenticated()});
  }

  setVenueInfo(id, description){
    AuthenticationStore.getResouceDetails(
      "venues",
      id,
      function(info){this.setState({
        id: id,
        amenities: info.amenities.map(function(amenity){return this.amenitiesConversion[amenity]},this),
        arrival_instructions: info.arrival_instructions,
        lat:  info.lat,
        lon: info.lon,
        venue_type: this.venueConversion[info.venue_type],
        description: description
      });
      this.serverInformation ={
        amenities: info.amenities.map(function(amenity){return this.amenitiesConversion[amenity]},this),
        arrival_instructions: info.arrival_instructions,
        lat:  info.lat,
        lon: info.lon,
        venue_type: this.venueConversion[info.venue_type],
        description: description
      }}.bind(this)
    );
  }

  addressEntered(suggest){
    this.setState({"lat": suggest.location.lat, "lon": suggest.location.lng})
  }

  validateFields()
  {
    const conditions = {
      description: this.state.description.length < this.minimumRequeriments.description,
      map: this.state.lat == "",
      amenities: this.state.amenities.length == 0,
      venueType: this.state.venue_type == "",
      venuePhotos: this.state.venuePhotos.length < this.minimumRequeriments.venuePhotos,
      instructions: this.state.arrival_instructions.length < this.minimumRequeriments.instructions
    }

    this.setState(update(this.state,
      {validationHtml: {
        description: {$set: conditions.description ? this.invalidFieldStyle : {} },
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
      HAct.updateHost(
        this.state.id,
        this.state.hostid,
        this.state.arrival_instructions,
        this.state.lat,
        this.state.lon,
        this.state.amenities,
        this.state.venue_type,
        this.state.venuePhotos,
        this.state.description,
        this.renderResponse
      );
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

  renderResponse(code, response){
    if(code < 400){
      this.setState({modalHtml:
        <div>
          <h3 class="text-center">Host information changed successfuly</h3>
          <br></br>
          <div>
            <button class="btn btn-block btn-large btn-success" onClick={ function(){ this.setState({modalOpen: false})}.bind(this) }>Got it!</button>
          </div>
        </div>,
        modalOpen: true
      });
        for (var k in this.serverInformation){
          this.serverInformation[k] = this.state[k];
        }
    }
    else{
      this.setState({modalHtml:
        <div>
          <div class="text-center">
            <h3 class="text-center">We had some trouble contacting the servers.</h3>
            <p>Please try again later. Error code: {code} - {response.statusText}</p><br/>
          </div>
          <div>
            <button class="btn btn-block btn-primary" onClick={ function(){ this.setState({modalOpen: false})}.bind(this) }>Okay</button>
          </div>
        </div>,
        modalOpen: true
      })
    }
  }

  render(){
    if(this.state.authenticated && AuthenticationStore.isHost()){
      const labelStyle={color:"rgb(181, 109, 55)"};
      return(
        <div style={{marginTop:"75px"}}>
          <div class="container" id="myHost" style={{borderRadius: "15px", marginTop:"25px", paddingBottom: "15px", backgroundColor: "rgb(240,240,240)"}}>
            <h2 class="text-center">My Public Profile </h2>
            <label class="text-uppercase"  style={labelStyle}>Description </label>
            <span style={{color:"gray"}}><em>It&#39;s important to describe yourself as host. Guests like to read some words about you.</em></span>
            <br/>
            <textarea rows="7" class="form-control" value={this.state.description} onChange={function(obj){ this.setState({description: obj.target.value}) }.bind(this)}/>
          </div>

          <div class="container" id="myVenue" style={{borderRadius: "15px", paddingBottom: "15px", marginTop:"25px", backgroundColor: "rgb(240,240,240)"}}>
            <h2 class="text-center">My Venue</h2>
            <div class="row">
              <div class="col-md-6 col-md-offset-3 text-left">
                <label class="text-uppercase"  style={labelStyle}>Whats your address:</label><br/>
                <small><FaAsterisk style={{color:"#CCCC5C"}}/> <span style={{color:"gray"}}><em>We&#39;ll only disclose your address after a guest is confirmed and payment is done in advance. In the meantime we only show an approximate location.</em></span></small>
                <Geosuggest placeholder="Start typing your full address" country="PT" onSuggestSelect={this.addressEntered.bind(this)} style={{'input': this.state.validationHtml.map }}/>
                <Gmaps
                  width={'100%'}
                  height={'300px'}
                  lat={this.state.lat}
                  lng={this.state.lon}
                  zoom={17}
                  loadingMessage={'Loading map...'}
                  params={{v: '3.exp', key: 'AIzaSyDTm73KUiiVgqgizfkY24TvGA_BxDIOkvs'}}>
                  <Marker lat={this.state.lat} lng={this.state.lon} draggable={false} />
                  <Circle lat={this.state.lat} lng={this.state.lon} radius={100} fillColor={"green"} strokeWeight={1} clickable={false} strokeColor={"green"} />
                </Gmaps>

              </div>

              <div class="col-md-6 col-md-offset-3 text-left">
                <br/>
                <label class="text-uppercase" style={labelStyle}>Arrival instructions <span class="small"> <em>(Minimum {this.minimumRequeriments.instructions} characters )</em> </span></label>
                <input class="form-control"
                  onChange={function(instructions){ this.setState({arrival_instructions:instructions.target.value}) }.bind(this)}
                  placeholder="Ex: Ring doorbell 3A"
                  value={this.state.arrival_instructions}
                  style={this.state.validationHtml.instructions}></input>
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
                  selectedValue = {this.state.venue_type}
                  onChange={function(type){ this.setState({venue_type:type}) }.bind(this)}
                  style={{textAlign: "justify", margin: "0 auto", width: "30em", ...this.state.validationHtml.venueType}}>
                  <Radio value="dinRoom"/>Dining Room <br/>
                  <Radio value="kitchen"/>Kitchen <br/>
                  <Radio value="backyard"/>Backyard <br/>
                  <Radio value="terrace"/>Terrace <br/>
                  <Radio value="other"/>Other
                  </RadioGroup>
                  <br/>
                  <label class="text-uppercase"  style={labelStyle}>Amenities</label>
                  <CheckboxGroup
                    name="amenities"
                    value={this.state.amenities}
                    onChange={function(amenity){ this.setState({amenities:amenity}) }.bind(this)}
                    style={{textAlign: "justify", margin: "0 auto", width: "30em", ...this.state.validationHtml.amenities}}>
                    <Checkbox value="petFriendly"/>Pet Friendly<br/>
                    <Checkbox value="easyTransport"/>Easily reached by public transportation<br/>
                    <Checkbox value="freePark"/>Free street parking<br/>
                    <Checkbox value="allowSmoking"/>Smoke Allowed<br/>
                    <Checkbox value="wifi"/>Wifi Available<br/>
                    <Checkbox value="other"/>Other
                    </CheckboxGroup>

                    <br/>

                  </div>

                </div>
                <div class="row">
                  <div class="col-md-6 col-md-offset-3">
                    {this.state.errorHtml}
                    <div onClick={() => this.verifyAndRedirect()} class="center-block btn btn-lg btn-primary">Submit</div>
                  </div>
                </div>
                <Modal
                  isOpen={this.state.modalOpen}
                  onRequestClose={ function(){ this.setState({modalOpen: false})}.bind(this) }
                  contentLabel="ModalSuccessInfo"
                  shouldCloseOnOverlayClick={true}
                  style={
                    {
                      overlay : {
                        zIndex              : '10'
                      },
                    content: {
                      top                   : '50%',
                      left                  : '50%',
                      right                 : 'auto',
                      bottom                : 'auto',
                      transform             : 'translate(-50%, -50%)'
                    }}
                  }>
                      {this.state.modalHtml}
                </Modal>
              </div>
        </div>

        )
    }
    else { //Failsafe for unauthorized access
      return(
        <div style={{marginTop:"50px"}}>
          <h2>You don't have permission to access this content</h2>
        </div>
      )
    }
  }

}
