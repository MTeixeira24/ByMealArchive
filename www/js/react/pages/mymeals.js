import React from "react";
import * as BookAct from "../../actions/bookActions";
import Loading from 'react-loading-animation';
import StripeCheckout from 'react-stripe-checkout';
var Config = require('Config');
import { Link } from "react-router";
import AuthenticationStore from "../../stores/authenticationStore.js";
import MealDetail from "../components/mealDetail.js";
import Modal from 'react-modal';

const mealDetailModelStyle = {
  content : {
    top                   : '60px',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, 0%)',
    maxWidth              : '600px',
    position              : 'relative',
    overflow              : 'visible',
    padding               : '0' ,
    marginBottom          : '60px'
  },
  overlay : {
    overflowY            : 'overlay',
    overflowX            : 'hidden',
    zIndex               : '10'
  }
};

export default class MyMeals extends React.Component{
  constructor(){
    super();
    this.state = { mealResults:null, error:false, userEmail: null, activeMeal: -1, mealDetailOpen: false };
    this.getHtmlMealElement = this.getHtmlMealElement.bind(this);
    this.onToken = this.onToken.bind(this);
  }

  componentWillMount() {
    if (!AuthenticationStore.userDetail.loggedUserData)
    {
      AuthenticationStore.getLoggedUserData(
        function(data){
          this.setState({ userEmail: data.email })
        }.bind(this)
      )
    }
    else {
      this.setState({ userEmail: AuthenticationStore.userDetail.email })
    }
    BookAct.loadGuestMeals( function(mealResults){
      this.setState({mealResults: mealResults})
    }.bind(this),
    function(){
      this.setState({error: true})
    }.bind(this))
  }

  onToken(token, requestId)
  {
    BookAct.pay(token.id, requestId)
  }

  openMealDetail(ind){
    this.setState({activeMeal: ind, mealDetailOpen: true})
  }

  getHtmlMealElement() {
    if (this.state.error)
    {
      return(
        <tr >
          There was an error obtaining your meals. Try logging off and logging in again.
        </tr>
      )
    }
    if (!this.state.mealResults)
    {
      return (<div></div>)
    }
    if (this.state.mealResults && this.state.mealResults.length == 0)
    {
      return (<div>You haven't yet booked any meals.
      <div class="text-center">
        <Link to="searchmeal"><button>Search Meals!</button></Link>
      </div>
    </div>)
  }
  return (this.state.mealResults.map((result, index) =>
  <tr key={index}>
    <td>
      <div  style={{backgroundColor: "rgb(240,240,240)", paddingTop: "20px",marginTop:"15px"}}>
        <div class="row" style={{width: "720px"}}>
          <div class="col-md-5">
            <div onClick={() => this.openMealDetail(index)} class="pull-left">
              <div style={{
                marginBottom: "5px",
                width: "300px",
                height: "100px",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage:"url("+result.mealPhotos[0]+")",
                borderRadius: "10px"
              }}>
              <span style={{
                color: "white",
                backgroundColor: "rgba(200, 200, 200, 0.701961)",
                paddingTop: "7px",
                paddingBottom: "7px",
                paddingRight: "5px",
                paddingLeft: "5px",
                position: "relative",
                top: "20px"
              }}><b>{result.price} €</b></span>
              <div class="text-center" style={{
                color: "white",
                paddingTop: "10px"
              }}>
                <h4 style={{textTransform: "uppercase", fontWeight:"bold"}}>{result.mealTitle}</h4>
              </div>
              </div>
            </div>
          </div>
          <div class="col-md-2" style={{paddingRight: "0px", marginTop:"5px"}}>
            <div  style={{marginLeft: "7px"}}>
              <span>Host: {result.first_name}</span><br/>
              <span>{result.date}</span><br/>
              <span>{result.guests} Guests</span><br/>
              <span>Payment: {result.price*result.guests}€</span><br/>
            </div>
          </div>
          <div class="col-md-5 text-center" style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100px"
          }}>
          <div>
            {this.getButtonHtml(result.status, result.price*result.guests*100)}
          </div>

          </div>
          {this.getCancelHtml(result.status)}
        </div>
      </div>


          </td>
        </tr> ));
      }

      getButtonHtml(status, cost){
        switch (status) {
          case "PENDING_APPROVAL":
            return(
              <span class="text-uppercase" style={{
                textAlign: "center",
                border: "2px solid rgb(198,198,198)",
                backgroundColor: "white",
                color: "black",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "5px",
                paddingBottom: "5px",
                width: "150"
              }}>Pending Approval</span>
            )
            break;
          case "PROCEED_TO_PAYMENT":
          return(
            <div>
              <StripeCheckout
                token={(token) => this.onToken(token, result.requestId)}
                email={this.state.userEmail}
                stripeKey={Config.stripe_publishable_key}
                amount={cost}
                currency="EUR">
                <a class="btn" href="#/my_meals"><span style={{
                  textAlign: "center",
                  border: "2px solid rgb(198,198,198)",
                  backgroundColor: "rgb(240,240,240)",
                  color: "black",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  width: "150"
                }}>Proceed to payment</span></a>
                </StripeCheckout>
          </div>
            )
            break;
          case "HOST_REFUSED":
          return(
            <span class="text-uppercase" style={{
              textAlign: "center",
              border: "2px solid rgb(198,198,198)",
              backgroundColor: "rgb(198,0,0)",
              color: "white",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "5px",
              paddingBottom: "5px",
              width: "150"
            }}>Host Refused</span>
            )
            break;
          case "CANCELLED":
          return(
            <span class="text-uppercase" style={{
              textAlign: "center",
              border: "2px solid rgb(198,198,198)",
              backgroundColor: "rgb(198,0,0)",
              color: "white",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "5px",
              paddingBottom: "5px",
              width: "150"
            }}>Cancelled</span>
            )
            break;
          case "MEAL_CONFIRMED":
          return(
            <span class="text-uppercase" style={{
              textAlign: "center",
              border: "2px solid rgb(198,198,198)",
              backgroundColor: "rgb(0,120,0)",
              color: "white",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "5px",
              paddingBottom: "5px",
              width: "150"
            }}>Meal Confirmed</span>
            )
            break;
          default:
            break;

        }
      }

      getCancelHtml(status){
        switch (status) {
          case "PENDING_APPROVAL":
          case "PROCEED_TO_PAYMENT":
            return(
            <div class="text-right" style={{width: "700px"}}>
              <a href="#/my_meals"
              onClick={function(){/*TODO function to put CANCELLED status on rest*/}.bind(this)}>
              Cancel meal</a>
            </div>);
          default:
            return "";
        }
      }

      render(){
        return(
          <div>
            <div style={{
              position: "fixed",
              left: "0",
              right: "0",
              backgroundPosition: "center",
              backgroundImage: "url(./img/my_listed_meals_header.jpg)",
              marginTop:"50px",
              padding: "60px 0 60px 0",
              backgroundSize: "100%",
              filter: "blur(3px)",
              maxHeight: "160px",
              zIndex: "1"

              }} class="text-center navbar-fixed-top"></div>
            <div style={{
              position: "fixed",
              left: "0",
              right: "0",
              zIndex: "2",
              color: "white"
            }} class="container text-center">
              <h1 style={{marginTop: "0px"}}><b>My Booked Meals</b></h1>
            </div>

            <div class="container" style={{marginTop: "90px"}}>
              <div class="row" >
                <section class="content">
                  <div class="col-md-8 col-md-offset-2">
                    <div class="panel panel-default">
                      <div class="panel-body">
                        <div class="table-container">
                          <table class="table table-filter">
                            <tbody>
                              <Loading isLoading={!(this.state.mealResults || this.state.error)}>
                                {this.getHtmlMealElement()}
                              </Loading>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <Modal
              isOpen={this.state.mealDetailOpen}
              onRequestClose={ function(){ this.setState({mealDetailOpen: false})}.bind(this) }
              contentLabel="MealDetail"
              shouldCloseOnOverlayClick={true}
              style={mealDetailModelStyle}
            >
              {this.state.activeMeal != -1 &&
              <div>
              <div className="modal-header">
                <button type="button" className="close" onClick={ function(){ this.setState({mealDetailOpen: false})}.bind(this) }>
                  <span aria-hidden="true">&times;</span>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <MealDetail
                userId={this.state.mealResults[this.state.activeMeal].hostId}
                mealId={this.state.mealResults[this.state.activeMeal].mealId}
                booking={false}
                closeMealDetail={function(){ this.setState({mealDetailOpen: false})}.bind(this)}
              />
              </div>
              }
            </Modal>
          </div>

        )
      }
    }
