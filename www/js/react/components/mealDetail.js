import React from "react";
import FaStar from 'react-icons/lib/fa/star';
import MdRestaurant from 'react-icons/lib/md/restaurant';
import MdLocalParking from 'react-icons/lib/md/local-parking';
import FaUser from 'react-icons/lib/fa/user'
import FaPaw from 'react-icons/lib/fa/paw';
import FaHome from 'react-icons/lib/fa/home';
import FaTrain from 'react-icons/lib/fa/train';
import MdSmokingRooms from 'react-icons/lib/md/smoking-rooms'
import MdNetworkWifi from 'react-icons/lib/md/network-wifi';
import ReadMore from './readmore.js';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import AuthenticationStore from "../../stores/authenticationStore.js";
import update from 'react-addons-update';
import Carousel from 'nuka-carousel';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import NumericInput from 'react-numeric-input';
import * as BookAct from "../../actions/bookActions";
import BStore from "../../stores/bookMealStore";
import Modal from 'react-modal';
import Loading from 'react-loading-animation';

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
const venueTypeMapper = {
  "DINING_ROOM" :  (<div class="row">Dining room</div>),
  "KITCHEN" : (<div class="row">Kitchen</div>),
  "BACKYARD" : (<div class="row">Backyard</div>),
  "Terrace" : (<div class="row">Terrace</div>),
  "OTHER" : (<div class="row">Other (see description)</div>)
}
const amenitiesMapper = {
  "PET_FRIENDLY" :  (<div class="row"><FaPaw/> Pet-friendtly</div>),
  "PUBLIC_TRANSPORTATION" : (<div class="row"><FaTrain/> Public transportation</div>),
  "FREE_PARKING" : (<div class="row"><MdLocalParking/> Free street parking</div>),
  "SMOKING" : (<div class="row"><MdSmokingRooms/> Smoking allowed</div>),
  "WIFI" : (<div class="row"><MdNetworkWifi/> Wifi</div>),
  "OTHER" : (<div class="row">Other (see description)</div>)
}
const infoModalStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',

  },
  overlay : {
    zIndex: "1000000"
  }
};

export default class MealDetail extends React.Component{
  mixins: [Carousel.ControllerMixin];
  constructor(){
    super();
    this.state = {
      remainingContent:<div class="text-center"> <em> Scroll down to view more </em></div>,
      data:{ venue: {
        amenities: [],
        venue_type: []
      },
      meal:  {
        title:"",
        hostingStyle:"",
        description: "",
        photos: [ ],
        tags: [ ],
        menu: [ ],
        guests: 1,
        price: "",
        paymentMethod: ""
      },
      user:  {
        first_name: "",
        host: {description: "",
          date_joined: ""}
        },
      },
      bookingdata: {
        date: moment(),
        guests: 1,
        note: ""
      },
      bookingform: {
        focused:false,
        showNote:false,
        minimized:true
      },
      infoModal: {show:false,
                  message:[],
                  booksuccess:false}
    };
    this.getFeedback = this.getFeedback.bind(this);
    this.mapHtml = this.mapHtml.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  getJoiningDate(){
    let date = new Date(this.state.data.user.date_joined);
    return (<div> { monthNames[date.getMonth()] }, {date.getFullYear()} </div>)
  }

  updateData(userDetail, venueDetail, mealDetail){
    this.setState(update(this.state,
      {data: {
        user:  { $set: userDetail  },
        venue: { $set: venueDetail },
        meal:  { $set: mealDetail  }
      }
    }
  ));
}

componentWillMount(){
  if (this.props.userId)
  {
    AuthenticationStore.getResouceDetails("users", this.props.userId,
    function(userDetails){
      AuthenticationStore.getResouceDetails("venues", userDetails.host.venue,
      function(venueDetails){
        if (this.props.mealTemplateData)
        this.updateData(userDetails, venueDetails, this.props.mealTemplateData);
        else
        AuthenticationStore.getResouceDetails("meals", this.props.mealId,
        function(mealDetails){
          this.updateData(userDetails, venueDetails, mealDetails);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
}

mapHtml(incomingData, template){
  var html = [];
  for (var i = 0; i < incomingData.length; i++) {
    html.push( template[incomingData[i]] )
  }
  return html;
}

handleBookForm()
{
  if (this.props.mealTemplateData)
  {
    this.setState(update(this.state, {infoModal: { show:  { $set: true  },
      message: { $set: (<div><h3>Preview Mode</h3><br/>
      This is just a preview of the meal detail other users will see.<br/>
    After you&#39;ve submittted this meal other users will be able to request a book date by clicking here!
  </div>)  }} }))
  return;
}
if (!AuthenticationStore.isAuthenticated())
{
  $('.modal-login').modal('show')
}
else {
  if (this.state.data.user.id == AuthenticationStore.userDetail.loggedUserData.id)
  {
    this.setState(update(this.state, {infoModal: { show:  { $set: true  },
      message: { $set: (<div><h3>This meal is yours!</h3><br/>
      This meal belongs to you (the host)<br/>
    There&#39;s no need to book a meal to have your own food :) !
  </div>)  }} }))
  return;
}

this.setState(update(this.state, {infoModal: { show:  { $set: true  }  } }))
BookAct.makeBookRequest(this.state.bookingdata, this.props.mealId,
  function(){
    this.setState(update(this.state, {infoModal: { message:  { $set: (<div><h3>Awesome!</h3><br/>
                                                                  Your meal request has been sent to the host, who will get back to you shortly!<br/>
                                                                We&#39;ll also send you an e-mail so that you don&#39;t forget all about your meal request.
                                                              </div>)  },
                                                   booksuccess: {$set: true}  } }))
}.bind(this),
function(){

}
);
}
}
getBookHtml()
{
  if(this.props.booking){
  var textArea = (this.state.bookingform.showNote == true) ?
  (<textarea
    onChange={(e) => this.setState(update(this.state, {bookingdata: { note:  { $set: e.target.value  } } } ))}
    rows="2"
    class="form-control"
    id="description"
    placeholder="Say hi to the host!"
    style={{resize:"none"}}/>):
    []

    if (this.state.bookingform.minimized)
    {
      return(<div class="container-fluid" style={{ marginLeft:"10px", marginRight:"10px"}}>
      <div class="row">

        <div class="col-md-6 "  style={{borderRadius:"6px", border:"1px solid orange", boxShadow: "3px 1px 10px 0px grey"}}>
          <div class="row" style={{marginLeft:"15px", marginRight:"10px"}}>
            <div class="col-xs-6 text-left">
              <div class="row" >
                <div class="row">
                  <label class="text-uppercase" style={{color:"rgb(181, 109, 55)"}} >When?</label>
                </div>
                <div class="row">
                  <SingleDatePicker
                    id="date_input"
                    date={this.state.bookingdata.date}
                    focused={this.state.bookingform.focused}
                    onFocusChange={(focused) =>
                      {
                        this.setState(update(this.state, {bookingform: { focused:  { $set: focused.focused  },
                          minimized:  { $set: false  }} } ))
                        }
                      }
                      numberOfMonths={1}
                      showDefaultInputIcon={true}
                      displayFormat="MMMM Do,YYYY"
                      hideKeyboardShortcutsPanel={true}

                      />
                  </div>

                </div>


              </div>

            </div>

            <button class="btn btn-primary btn-inline page-scroll btn-block"
              style={{marginBottom:"5px"}}
              onClick={() => this.setState(update(this.state, {bookingform: { minimized:  { $set: false  },
                focused:    { $set: true   }} } ))}>Book</button>
            </div>

          </div>
        </div>
      );
    }
    else
    {
      return(
        <div class="container-fluid" style={{ marginLeft:"10px", marginRight:"10px"}}>
          <div class="row">

            <div class="col-md-12"  style={{borderRadius:"6px", border:"1px solid orange", boxShadow: "3px 1px 10px 0px grey"}}>
              <div class="row" style={{marginLeft:"15px", marginRight:"10px"}}>
                <div class="col-xs-6 text-left">
                  <div class="row" >
                    <div class="row">
                      <label for="numberGuests" class="text-uppercase" style={{color:"rgb(181, 109, 55)"}} >When?</label>
                    </div>
                    <div class="row">
                      <SingleDatePicker
                        id="date_input"
                        date={this.state.bookingdata.date}
                        focused={this.state.bookingform.focused}
                        onDateChange={(date) =>     this.state.bookingdata.date=date }
                        onFocusChange={(focused) =>
                          {
                            this.setState(update(this.state, {bookingform: { focused:  { $set: focused.focused  } } } ))
                          }}
                          numberOfMonths={1}
                          showDefaultInputIcon={true}
                          displayFormat="MMMM Do,YYYY"
                          hideKeyboardShortcutsPanel={true}

                          />
                      </div>

                    </div>

                    <div class="row">
                      <div class="row">
                        <label for="numberGuests" class="text-uppercase" style={{color:"rgb(181, 109, 55)"}} >How Many?</label>
                      </div>
                      <div class="row">
                        <div style={{display:"inline-block"}}>
                          <NumericInput
                            min={1}
                            max={25}
                            value={this.state.bookingdata.guests != null ? this.state.bookingdata.guests : 1}
                            className="form-control"
                            id="guests"
                            onChange={(guests) =>
                              this.setState(update(this.state, {bookingdata: { guests:  { $set: guests  } } } ))
                            }
                            /></div>

                          <div style={{display:"inline-block", marginLeft:"-45px", position:"relative"}}>
                            <FaUser style={{width:"20px", height:"20px"}}/>
                          </div>
                        </div>



                      </div>
                    </div>
                    <div class="col-xs-6 text-right" style={{marginTop:"15px"}}>
                      <div class="row">
                        {this.state.data.meal.price}€ x {this.state.bookingdata.guests} guests
                      </div>
                      <hr style={{marginRight:"-15px", marginBottom:"0", borderWidth:"2px", maxWidth:"60%"}}/>
                      { (this.state.data.meal.price*this.state.bookingdata.guests).toFixed(2) } €
                    </div>
                  </div>
                  <div class="row" style={{marginLeft:"0", marginRight:"0"}}>
                    <label for="description" class="text-uppercase" style={{color:"rgb(181, 109, 55)"}}>Add a small note to the host.<small> <em>(optional)</em></small></label>
                    <a style={{marginLeft:"8px", fontWeight: "bolder", fontSize: "larger"}}
                      onClick={() => this.setState(update(this.state, {bookingform: { showNote:  { $set: !this.state.bookingform.showNote  } } } ))}
                      >{this.state.bookingform.showNote == true ? "-" : "+"}</a>
                    {textArea}
                  </div>
                  <button class="btn btn-primary btn-inline page-scroll btn-block"
                    style={{marginBottom:"5px"}}
                    onClick={() => this.handleBookForm()}>Book</button>
                </div>

              </div>
            </div>
          );
        }
        }
      }
      getMealPhotosHtml(){
        var html = [];
        // html.push( <img src="https://bymeal.s3.amazonaws.com/meals/e3845fbb8dc7c4015a7ba9ca7aa6693bde7a4ba8.jpg" key={0}/> )
        // html.push( <img src="https://bymeal.s3.amazonaws.com/meals/90cb88f4784f1b2dacbf152e24fa63d8e51d0f34.jpg" key={1}/> )
        for (var i = 0; i < this.state.data.meal.photos.length; i++) {
          html.push( <img
            src={this.state.data.meal.photos[i]}
            key={i}
            style={{ maxHeight:"400px"}}
            onLoad={() => {window.dispatchEvent(new Event('resize'));}}
            /> )
          }
          var Decorators = [{
            component: React.createClass({
              render() {
                return (
                  <button
                    onClick={this.props.previousSlide}>
                    Previous Slide
                  </button>
                )
              }
            }),
            position: 'CenterLeft',
            style: {
              padding: 20
            }
          }];

          return(
            <div >
              {html.length > 0 &&
                <Carousel
                  decorators={Carousel.getDefaultProps().decorators.slice(0, 2)}
                  heightMode='max'>
                  {html}
                </Carousel>
              }
            </div>
          )

        }
        getMenueHtml(){
          return(
            <div class="container-fluid text-center" style={{borderRadius:"6px", border:"1px solid orange", marginLeft:"10px", marginRight:"10px", marginTop: "20px", marginBottom: "10px", boxShadow: "3px 1px 10px 0px grey"}}>
              <div class="col-sm-3 col-xs-4 text-left" style={{ marginLeft: "-40px", marginTop:"-20px"}}>
                <div class="row">
                  <div class="thumbnail" style={{
                      display:"inline-block",
                      height:"100px",
                      width:"100px",
                      overflow:"hidden",
                      borderRadius:"50%",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      backgroundImage: "url(https://static.squarespace.com/static/5229dcade4b054f0e185b5f4/t/522dedf0e4b074119b2458ac/1378741744995/Seafood-dish-wallpaper_4074.jpg)",
                      boxShadow: "0px 0px 10px 0px gray",
                      marginBottom:"0px"
                    }}>
                  </div>
                </div>
              </div>
              <div class="col-sm-9 col-xs-8 text-left">
                <div class="row" style={{marginTop:"-20px"}}>
                  <h4><span style={{backgroundColor:"white"}}><b>The Menu</b></span></h4>
                </div>

                <div>
                  <big>
                    {this.state.data.meal.tags.map(function(obj){
                      return(
                        <span style={{marginRight:"5px"}} class="label label-info">{obj}</span>
                      )
                    })}
                  </big>
                  <div style={{
                      // background: "#fff url(../img/white_paperboard.jpg)",
                      // // width: "100%",
                      // // position: "absolute",
                      padding: "20px",
                      // boxShadow: "inset 0 0 0 16px #fff"
                      // // boxShadow: "inset 0 0 0 16px #fff, inset 0 0 0 17px #e6b741, inset 0 0 0 18px #fff, inset 0 0 0 19px #e6b741, inset 0 0 0 20px #fff, inset 0 0 0 21px #e6b741"
                    }}>


                    {this.state.data.meal.menu.map(function(obj){
                      return (
                        <div>
                          <div style={{fontWeight: "500",textTransform: "uppercase",  wordWrap:"break-word"}}>
                            {obj.title}
                          </div>
                          <div style={{fontWeight: "500",  wordWrap:"break-word"}}>
                            <em>{obj.description}</em>
                          </div><br/>
                        </div>
                      );
                    })}

                  </div>
                </div>

              </div>
            </div>
          );
        }

        getSpaceHtml(){
          return(
            <div class="container-fluid text-center" style={{borderRadius:"6px", border:"1px solid orange", marginLeft:"10px", marginRight:"10px", marginTop: "20px", boxShadow: "3px 1px 10px 0px grey"}}>
              <div class="col-sm-3 col-xs-4 text-left" style={{ marginLeft: "-40px", marginTop:"-20px"}}>
                <div class="row">
                  <div class="thumbnail" style={{
                      display:"inline-block",
                      height:"100px",
                      width:"100px",
                      overflow:"hidden",
                      borderRadius:"50%",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      backgroundImage: "url(https://static.pexels.com/photos/186077/pexels-photo-186077.jpeg)",
                      boxShadow: "0px 0px 10px 0px gray",
                      marginBottom:"0px"
                    }}>
                  </div>
                  <div class="row small" style={{marginLeft:"30px", marginRight:"20px"}}>
                    <em>Click to see photos of the venue.</em>
                  </div>
                </div>
              </div>
              <div class="col-sm-9 col-xs-8 text-left">
                <div class="row" style={{marginTop:"-20px"}}>
                  <h4><span style={{backgroundColor:"white"}}><b>The Space</b></span></h4>
                </div>
                {/*
                  <div class="row small">
                  Relaxed antique house in the middle of nowhere.
                  </div>
                  */}

                  <div class="row" style={{marginTop:"10px", marginBottom:"10px"}}>
                    <div class="col-md-6">
                      <b> Amenities </b>
                      <div style={{}}>
                        {this.mapHtml(this.state.data.venue.amenities, amenitiesMapper)}
                      </div>
                    </div>
                    <div class="col-md-6">
                      <b> Venue Type </b>
                      <div style={{}}>
                        { venueTypeMapper[this.state.data.venue.venue_type] }
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            );
          }


          getHostHtml(){
            return(
              <div class="container-fluid text-center" style={{borderRadius:"6px", border:"1px solid orange", marginLeft:"10px", marginRight:"10px", marginTop: "20px", boxShadow: "3px 1px 10px 0px grey"}}>
                <div class="col-sm-3 col-xs-4 text-left" style={{ marginLeft: "-40px", marginTop:"-20px"}}>
                  <div class="row">
                    <div class="thumbnail" style={{
                        display:"inline-block",
                        height:"100px",
                        width:"100px",
                        overflow:"hidden",
                        borderRadius:"50%",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundImage: "url(./img/person1.jpg)",
                        boxShadow: "0px 0px 10px 0px gray",
                        marginBottom:"0px"
                      }}>
                    </div>
                    <div class="row small" style={{marginLeft:"30px", marginRight:"20px"}}>
                      Joined in {this.getJoiningDate()}
                    </div>
                  </div>
                </div>
                <div class="col-sm-9 col-xs-8 text-left">
                  <div class="row" style={{marginTop:"-20px"}}>
                    <h4><span style={{backgroundColor:"white"}}><b>The host</b></span></h4>
                  </div>
                  <div class="row">
                    <b>{this.state.data.user.first_name}</b>
                  </div>
                  <div class="row small" style={{wordWrap:"break-word"}}>
                    <Loading isLoading={this.state.data.user.host.description == ""}>
                      {this.state.data.user.host.description}
                    </Loading>

                  </div>
                  {/*
                    <div class="row" style={{color: "rgb(241, 222, 59)"}}>
                    <FaStar key={0}/> <FaStar key={1}/> <FaStar key={2}/> <FaStar key={3}/> <FaStar key={4}/>
                    </div>


                    <div class="row" style={{marginTop:"10px"}}>
                    <b> Recent Feedback </b>
                    <div style={{height:"150px", overflow:"auto"}}>
                    {this.getFeedback()}
                    </div>
                    </div>
                    */}
                  </div>
                </div>
              );
            }
            getFeedback(){
              return(
                <div>
                  {this.getFeedbackElement("./img/person2.jpg",
                    "Ananda was just great,  I adored his place and food!",
                    "Ana",
                    "May 2017", 4)}

                    {this.getFeedbackElement("./img/person3.jpg",
                      "Awesome food & price! would definatly come back again!",
                      "Sofia",
                      "April 2017", 5)}
                    </div>
                  );
                }


                getFeedbackElement(iconUrl, ratingText, authorName, date, rating){
                  return(
                    <div>
                      <blockquote class="small" style={{borderLeft:"solid 3px #f4ce21", marginBottom: "3px", paddingTop:"5px", paddingBottom:"0px"}}>
                        <div class="row">
                          <div class="col-md-2" style={{paddingLeft: "0px"}}>
                            <div class="thumbnail" style={{
                                display:"inline-block",
                                height:"50px",
                                width:"50px",
                                overflow:"hidden",
                                borderRadius:"50%",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center center",
                                backgroundImage:  'url(' + iconUrl + ')',
                                boxShadow: "0px 0px 10px 0px gray",
                                marginBottom: "0px"
                              }}/>
                            </div>
                            <div class="col-md-10" style={{paddingLeft: "0px"}}>
                              <q>{ratingText}</q>
                              <footer>{authorName} ({date})
                                {[...Array(rating)].map(function(object, i){
                                  return <FaStar key={i}/>;
                                })}
                              </footer>
                            </div>
                          </div>
                        </blockquote>
                      </div>
                    );
                  }

                  getBookFeedbackHtml()
                  {
                    return(      <Modal
                      isOpen={this.state.infoModal.show}
                      onRequestClose={
                        () => {
                          this.setState(update(this.state, {infoModal: { show:  { $set: false  }  } }))
                          if (this.state.infoModal.booksuccess)
                            this.props.closeMealDetail()
                          }
                        }
                      contentLabel="Example Modal"
                      shouldCloseOnOverlayClick={true}
                      style={infoModalStyle}
                      >
                      <Loading isLoading={this.state.infoModal.message.length == 0}>
                        {this.state.infoModal.message}
                      </Loading>
                    </Modal>)
                  }

                  genBookItButton(){
                    if(this.props.booking){
                      return(
                          <div class="btn btn-primary btn-inline page-scroll btn-block" style={{marginBottom:"5px"}}>Book it!</div>
                      )
                    }
                    else {
                      return "";
                    }
                  }

                  render(){
                    return(

                      <div >
                        {this.getBookFeedbackHtml()}

                        {/* CAROUSEL */}
                        {this.getMealPhotosHtml()}

                        {/*  MEAL DESCRIPTION */}
                        <h1 class="text-center" style={{wordWrap:"break-word"}}> {this.state.data.meal.title} </h1>
                        <div style={{marginBottom:"30px", color:"gray"}}>
                          <ReadMore children={this.state.data.meal.description}
                            lines={1}
                            />
                        </div>


                        {/* BOOK COMPONENT */}
                        {this.getBookHtml()}


                        <div class="row" style= {{marginRight:"0px", marginLeft:"0px"}}>
                          <div class="" style={{
                              height:"100px",
                              width:"100px",
                              overflow:"hidden",
                              backgroundSize: "cover",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center center",
                              marginBottom:"0px",
                              float:"right",
                              marginRight:"-100px",
                              transform: "translateY(100%)"
                            }}>


                            <div >
                              {this.genBookItButton()}
                            </div>
                          </div>


                          {/*  The Host */}
                          { this.getHostHtml() }


                          {/*  The Space */}
                          { this.getSpaceHtml() }


                          {/*  The Menu */}
                          { this.getMenueHtml()}


                        </div>
                      </div>


                    );
                  }
                }

                MealDetail.propTypes = {
                  userId : React.PropTypes.number.isRequired
                }
