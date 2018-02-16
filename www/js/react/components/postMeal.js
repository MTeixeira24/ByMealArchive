import React from "react";
import * as PMActions from "../../actions/postMealActions.js";
import PMStore from "../../stores/postMealStore.js";
import AuthenticationStore from "../../stores/authenticationStore.js";
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import UserGalleryUploader from "../components/userGalleryUploader.js";
import FaAsterisk from 'react-icons/lib/fa/asterisk';
import FaUser from 'react-icons/lib/fa/user'
import FaPlus from 'react-icons/lib/fa/plus'
import FaMinus from 'react-icons/lib/fa/minus'
import MdTrendingUp from 'react-icons/lib/md/trending-up';
import NumericInput from 'react-numeric-input';
import update from 'react-addons-update';
import MealDetail from "./mealDetail.js";
var Config = require('Config');
import HostStore from "../../stores/hostStore.js";
import Modal from 'react-modal';

export default class postMeal extends React.Component{
  constructor(){
    super();
    this.invalidFieldStyle = {backgroundColor: "rgba(255, 0, 0, 0.3)"};

    this.state = {
      value: PMStore.getValues(),
      page: 1,
      validationHtml: { },
      buttonHtml: this.getButtonHtml(1),
      menuItemsData: [],
      previousItems: (<div></div>),
      templateItem: {title:"", description:"", id:0},
      menuItemErrorHtml: (<div></div>),
      guests:null,
      price:null,
      userData:null,
      isHostAssociatedWithStripe:"new",

      infoModal: {show:false,
                  message:[],
                  booksuccess:false}
    };
    this.minimumRequeriments = {
      mealTitle:10,
      description:30,
      photos:1,
      menu:1

    }
    this.updateValues = this.updateValues.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.getTemplateMenuItem = this.getTemplateMenuItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.createOneItem = this.createOneItem.bind(this);
    this.generateDynamicMenuListHtml = this.generateDynamicMenuListHtml.bind(this);
    this.stripeAssociated = this.stripeAssociated.bind(this);
    this.getStripeHtml = this.getStripeHtml.bind(this);
  }

  removeItem(obj, e)
  {
    var index = this.state.menuItemsData.map(function(o) { return o.id; }).indexOf(obj.id);
    this.state.menuItemsData.splice(index, 1);
    this.generateDynamicMenuListHtml();
  }

  componentWillMount(){
    if (!AuthenticationStore.userDetail.loggedUserData)
    {
      AuthenticationStore.getLoggedUserData(
        function(data){
          this.setState({
            userData: data,
            isHostAssociatedWithStripe: data.host.stripe_user_id != "" ? "alreadyInStripe" : "new"
          })

        }.bind(this)
      )
    }
    else {
      this.setState({
        userData: AuthenticationStore.userDetail.loggedUserData,
        isHostAssociatedWithStripe: AuthenticationStore.userDetail.loggedUserData.host.stripe_user_id != "" ? "alreadyInStripe" : "new"
      })
    }
  }

  componentDidMount(){
    window.addEventListener('storage', this.stripeAssociated);
  }

  stripeAssociated(storage)
  {
    if ((storage.key == "stripe") && (storage.newValue != "error") && (storage.newValue != null) )
    {
      this.setState({isHostAssociatedWithStripe: "justJoined"});
    }
  }

  getStripeHtml()
  {
    switch (this.state.isHostAssociatedWithStripe) {
      case "new":
      return (<div>
        We use a secure and external payment platform,
        <a href="https://www.stripe.com" target="_blank">
          <img border="0" alt="stripe" src="../../img/stripe_logo.svg" height="20"/>
        </a>, which makes receiving your payment much simpler. From there you associate your preferred method which ByMeal will then use to transfer the funds, once a booking is made.
        <br/>
        <br/>
        Click on the button below to create an account on Stripe, so we can then tell Stripe to transfer you the funds once a booking has been made.
        <br/>
        <br/>
        <big>Please don't close this tab. It will be automatically updated once the association with Stripe has been made.</big>
        {this.state.userData &&
          <a class="center-block text-center "
            href={"https://connect.stripe.com/oauth/authorize?response_type=code" +
              "&client_id=" + Config.stripe_platform_client_id +
              "&stripe_user[first_name]=" + this.state.userData.first_name +
              "&stripe_user[last_name]=" + this.state.userData.last_name +
              "&stripe_user[email]=" + this.state.userData.email +
              "&scope=read_write" }  target="_blank">
              <img border="0" alt="stripe" src="../../img/stripe_connect.png" height="35"/>
            </a>
          }


        </div>);
        break;
        case "justJoined":
        return (<div>
          Thank you for successfully signing up on
          <a href="https://www.stripe.com" target="_blank">
            <img border="0" alt="stripe" src="../../img/stripe_logo.svg" height="20"/>
          </a>!
          <br/>
          <br/>
          You are now ready to be paid for your meals! You can proceed to the preview.

        </div>);
        break;
        default:
        return (<div>
          You are already on
          <a href="https://www.stripe.com" target="_blank">
            <img border="0" alt="stripe" src="../../img/stripe_logo.svg" height="20"/>
          </a>!
          , so it's all done here:)

        </div>);
        break;

      }

    }


    generateDynamicMenuListHtml()
    {
      let previousItemsTemp = this.state.menuItemsData.map( function(obj)
      {
        return this.getTemplateMenuItem(this.removeItem,false,obj)
      }, this);

      if (this.state.menuItemsData.length > 0)
      {
        previousItemsTemp = (<div>{previousItemsTemp} <hr style={{borderWidth:"1px", marginTop:"5px", marginBottom:"10px"}}/></div>)
      }

      this.setState({previousItems: previousItemsTemp})
      this.storeValues({id:'menu',
        value: this.state.menuItemsData.map( function(obj) {
          return (({ title, description }) => ({ title, description }))(obj)})
        });
      }

      createOneItem()
      {
        const newItem = JSON.parse(JSON.stringify(this.state.templateItem));
        if (newItem.title=="")
        {
          this.setState({menuItemErrorHtml: (<div class="row"><div class="col-xs-12" style={{color:"red"}}><small>We need at least the title of the dish before adding it to the menu!</small></div></div>)});
          return;
        }
        this.setState({templateItem:{title:"", description:"", id:newItem.id +1},
        menuItemErrorHtml:(<div></div>)});
        this.state.menuItemsData.push(newItem);
        this.generateDynamicMenuListHtml();

      }

      getTemplateMenuItem(callback, isTemplate, obj)
      {
        return (
          <div>
            <div class="row" key={obj.id}>
              <div class="col-xs-4">
                <input
                  type="text"
                  class="form-control"
                  defaultValue={obj? obj.title : ""}
                  onChange={function(e){obj.title = e.target.value;  }.bind(this) }
                  placeholder="Tomato Bruschetta"
                  />
              </div>
              <div class="col-xs-6">
                <input
                  type="text"
                  class="form-control"
                  defaultValue={obj? obj.description : ""}
                  onChange={function(e){obj.description = e.target.value;  }.bind(this) }
                  placeholder={isTemplate ? "Rubbed with garlic, drizzled with olive oil, with tomatoes and herbs": ""}
                  />
              </div>
              <div class="col-xs-1">
                <button
                  type="button"
                  class="btn btn-default"
                  onClick={callback.bind(this, obj)}
                  >
                  {isTemplate ? <FaPlus/> : <FaMinus/>}
                </button>
              </div>
            </div>
          </div>);
        }

        validatePage(page)
        {
          let values = PMStore.getValues();

          var conditions;
          switch (page) {
            case 1:
            conditions = {
              mealTitle: values.title < this.minimumRequeriments.mealTitle,
              description: values.description < this.minimumRequeriments.description,
              photos: values.photos.length < this.minimumRequeriments.photos,
              menu: values.menu.length < this.minimumRequeriments.menu,
            }
            this.setState(update(this.state,
              {validationHtml: {
                mealTitle: {$set: conditions.mealTitle ? this.invalidFieldStyle : {} },
                description: {$set: conditions.description ? this.invalidFieldStyle : {} },
                photos: {$set: conditions.photos ? this.invalidFieldStyle : {} },
                menu: {$set: conditions.menu ? this.invalidFieldStyle : {} }
              }}
            ));
            break;
            case 2:
            conditions = { stripe: this.state.isHostAssociatedWithStripe == "new" }
            this.setState(update(this.state,
              {validationHtml: {
                stripe: {$set: conditions.stripe ? this.invalidFieldStyle : {} }
              }}
            ));
            break;
            case 3:
            let that = this;
            return (PMStore.postMeal(
              function(){
                this.setState(update(this.state, {infoModal: { show:  { $set: true  }  ,
                                                                message: { $set:
                                                                  (<div><h3>Congratulations!</h3><br/>
                                                                  Your meal is now part of the ByMEAL community. <br/>
                                                                  We wish you the best of luck!
                                                                  </div>)
                                                                } } }))
                // return true;
              }.bind(this),
              function(){
                alert("Sorry, it appears we're having problem on our server side, please try again later.")
                return false
              }
            ))
            break;
          }
          for(var o in conditions){
            if(conditions[o]) {return false;}
          }
          return true;
        }

        updatePage(op){
          var aux = this.state.page;
          var newPage = aux;
          switch (op) {
            case '+':
            if (this.validatePage(aux)){
              newPage = aux +1;
            }
            else {
              if (aux == 3)
              {
                $('.modal-postmeal').modal('hide')
              }
              return;
            }
            break;
            case '-':
            newPage = aux - 1;
            break;
            case '1':
            newPage = 1;
            break;
            case '2':
            newPage = 2;
            break;
            case '3':
            if (this.validatePage(aux))
            newPage = aux +1;
            else
            console.log("There was an error in posting")
            return;
            break;
            default:
          }
          $('#mealPostCarousel').carousel(newPage-1);
          this.setState({page: newPage});
          this.setState({buttonHtml: this.getButtonHtml(newPage)});
        }

        getButtonHtml(page){
          switch (page) {
            case 1:
            return(
              <nav>
                <ul class="pager">
                  <li
                    onClick={() => this.updatePage('+')}
                    class="next">
                    <a class="right"
                      role="button"
                      >Next <span aria-hidden="true">&rarr;</span></a>
                  </li>
                </ul>
              </nav>
            );
            break;
            case 2:
            return(
              <nav>
                <ul class="pager">
                  <li
                    onClick={() => this.updatePage('-')}
                    class="previous">
                    <a class="left"
                      role="button"><span aria-hidden="true">&larr;</span> Previous</a>

                  </li>
                  <li
                    onClick={() => this.updatePage('+')}
                    class="next">
                    <a class="right"
                      role="button">Next <span aria-hidden="true">&rarr;</span></a>
                  </li>
                </ul>
              </nav>
            );
            break;
            case 3:
            return(
              <nav>
                <ul class="pager">
                  <li
                    onClick={() => this.updatePage('-')}
                    class="previous">
                    <a class="left"
                      role="button"><span aria-hidden="true">&larr;</span> Previous</a>

                  </li>
                  <li
                    onClick={() => this.updatePage('+')}
                    class="next">
                    <a class="right"
                      role="button">Submit</a>

                  </li>
                </ul>
              </nav>
            );
            break;
            case 4:
            return(
              <nav>
                <ul class="pager">
                  <li
                    onClick={() => $('.modal-postmeal').modal('hide')}
                    class="next">
                    <a class="right"
                      role="button">Close</a>

                  </li>
                </ul>
              </nav>
            );
            break;
            default:

          }
        }
        storeValues(val){
          PMActions.saveInfo(val.id, val.value);
        }


        componentWillUnmount(){

        }
        updateValues(){
          this.setState({value: PMStore.getValues()});
        }

        getSubmitButtonModalHandlerHtml()
        {
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

          return(      <Modal
            isOpen={this.state.infoModal.show}
            onRequestClose={
              () => {
                this.setState(update(this.state, {infoModal: { show:  { $set: false  }  } }))
                }
              }
            shouldCloseOnOverlayClick={true}
            style={infoModalStyle}
            >
              {this.state.infoModal.message}
          </Modal>)
        }

        render(){
          const labelStyle={color:"rgb(181, 109, 55)"};
          return(
          <div>
            <div class="modal fade modal-postmeal" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div id="mealPostCarousel" class="carousel slide" data-interval="false">
                    <div class="modal-header" style={{height:"50px"}}>
                      <h4 class="modal-title" style={{display: "inline-block"}}>Post a meal</h4>
                      <button type="button" class="btn close" data-dismiss="modal">&times;</button>
                      <ol class="carousel-indicators" style={{position: "relative"}}>
                        <li onClick={() => this.updatePage('1')} data-target="#mealPostCarousel" data-slide-to="0" class="active" style={{backgroundColor: "rgb(210,210,210)", border:"2px solid black", textIndent:"0", width:"25px", height:"25px", borderRadius: "25px" }}></li>
                        <li onClick={() => this.updatePage('2')} data-target="#mealPostCarousel" data-slide-to="1" style={{backgroundColor: "rgb(210,210,210)", border:"2px solid black", textIndent:"0", width:"25px", height:"25px", borderRadius: "25px"}}></li>
                        <li onClick={() => this.updatePage('3')} data-target="#mealPostCarousel" data-slide-to="2" style={{backgroundColor: "rgb(210,210,210)", border:"2px solid black", textIndent:"0", width:"25px", height:"25px", borderRadius: "25px"}}></li>
                      </ol>
                    </div>
                    <div class="modal-body" style={{padding:"0"}}>

                      <div class="carousel-inner" role="listbox">
                        <div class="item active" style={{padding:"15px"}}>
                          <form>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label for="service_type" class="text-uppercase" style={labelStyle}>Hosting style</label>
                                  <select class="form-control" id="service_type"
                                    onChange={function() {
                                      let rawValue = document.getElementById("service_type").value;
                                      let value
                                      if (rawValue == "both")
                                      {
                                        value = ["EXPERIENCE", "PRIVATE_DINING"]
                                      }
                                      else {
                                        value = [rawValue.toUpperCase()]
                                      }
                                      this.storeValues({id:"service_type", value: value}) }.bind(this)
                                    }>
                                    <option value="both">BOTH</option>
                                    <option value="experience">EXPERIENCE - Join your guest(s)</option>
                                    <option value="private_dining">PRIVATE DINING - Cook for your guest(s)</option>
                                  </select>
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label for="numberGuests" class="text-uppercase" style={labelStyle}>Number of guests</label>
                                  <br/>
                                  <div class="col-md-6" style={{padding:"0px"}}>
                                    <div style={{display:"inline-block"}}>
                                      <NumericInput
                                        min={1}
                                        max={7}
                                        value={this.state.guests != null ? this.state.guests : 1}
                                        className="form-control"
                                        format={function(e){
                                          if (e>=7)
                                          return e + "+";
                                          else
                                          return e;
                                        }
                                      }
                                      id="guests"
                                      onChange={() => {this.storeValues({ id: "guests", value:parseFloat(document.getElementById("guests").value)});
                                      this.setState({guests:document.getElementById("guests").value})}}
                                      /></div>
                                    <div style={{display:"inline-block", marginLeft:"-45px", position:"relative"}}>
                                      <FaUser style={{width:"20px", height:"20px"}}/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="form-group">
                              <label for="date" class="text-uppercase"  style={labelStyle}>Date</label><br/>
                              <input type="checkbox" value="" checked="checked" disabled/>Let the guest request the meal<br/>
                              <small><FaAsterisk style={{color:"#CCCC5C"}}/> <span style={{color:"gray"}}><em>We&#39;ll contact you on behalf of the guest to fix up a date that suits you best.</em></span></small>
                            </div>


                            <div class="form-group">
                              <label for="title" class="text-uppercase"  style={labelStyle}>Meal title<small> <em>(minimum {this.minimumRequeriments.mealTitle} characters)</em></small></label>
                              <input style={this.state.validationHtml.mealTitle} onChange={() => this.storeValues(document.getElementById("title"))} type="text" class="form-control" id="title" placeholder="Your eye-catching meal title"/>
                            </div>

                            <div class="form-group">
                              <label for="description" class="text-uppercase" style={labelStyle}>Description<small> <em>(minimum {this.minimumRequeriments.description} characters)</em></small></label>
                              <textarea onChange={() => this.storeValues(document.getElementById("description"))} rows="5" class="form-control" id="description" placeholder="Tell your guests what you&#39;re up to!" style={{resize:"none", ...this.state.validationHtml.description}}/>
                            </div>

                            <div class="form-group">
                              <label for="menu" class="text-uppercase" style={labelStyle}>Menu <small> <em>(minimum {this.minimumRequeriments.menu} dish)</em></small></label>
                              <div style={{border:"1px solid #D2D2D2", borderRadius:"3px", ...this.state.validationHtml.menu}}>
                                <div class="row">
                                  <div class="col-xs-4">
                                    <label class="control-label">Dish</label>
                                  </div>
                                  <div class="col-xs-6">
                                    <label class="control-label">Description <small>(optional)</small></label>
                                  </div>
                                </div>
                                {this.state.previousItems}
                                {this.getTemplateMenuItem(this.createOneItem, true, this.state.templateItem)}
                                {this.state.menuItemErrorHtml}
                              </div>
                            </div>

                            <div class="form-group">
                              <label for="menu" class="text-uppercase" style={labelStyle}>Food and meal Preferences</label>
                              <CheckboxGroup
                                name="type"
                                onChange={function(amenity){ this.storeValues({ id:'tags', value: amenity}) }.bind(this)}
                                >
                                <div class="row">
                                  <div class="col-md-6">
                                    <Checkbox value="vegan"/>Vegan<br/>
                                    <Checkbox value="glutenfree"/>Gluten free<br/>
                                    <Checkbox value="nuts"/>May contain nuts<br/>
                                  </div>
                                  <div class="col-md-6">
                                    <Checkbox value="organic"/>Organic<br/>
                                    <Checkbox value="wine"/>Served with wine
                                    </div>
                                  </div>
                                </CheckboxGroup>
                              </div>
                              <div class="form-group">
                                <label for="menu" class="text-uppercase" style={labelStyle}>Upload photos of your delicacies<small> <em>(minimum {this.minimumRequeriments.photos} photo)</em></small></label><br/>
                                <MdTrendingUp style={{color:"#CCCC5C"}}/> <span style={{color:"gray"}}><em>Better looking pictures will make more guests crave for your food!</em></span>
                                <UserGalleryUploader
                                  maxFiles={6}
                                  folderName={"meals"}
                                  onChange={function(e){this.storeValues({ id:'photos', value: e})}.bind(this)}/>
                              </div>
                            </form>
                          </div>

                          <div class="item" style={{padding:"15px"}}>
                            <form>
                              <div class="form-group">
                                <label for="price" class="text-uppercase" style={labelStyle}>Price<br/><small><em>(price per person)</em></small></label>
                                <NumericInput
                                  min={1.00}
                                  max={100.000}
                                  step={1.0}
                                  precision={2}
                                  value={this.state.price != null ? this.state.price : 1.00}
                                  className="form-control"
                                  format={function(e){
                                    return e + "€";
                                  } }
                                  id="price"
                                  onChange={() => {this.storeValues( {id:'price', value: parseFloat(document.getElementById("price").value)} );
                                  this.setState({price:document.getElementById("price").value})}}
                                  />
                              </div>
                              <div class="form-group">
                                <label for="price" class="text-uppercase" style={labelStyle}>Payment
                                  <a class="right" href="https://www.stripe.com" style={{marginLeft:"10px"}} target="_blank">
                                    <img style={{backgroundColor:"gray"}} border="0" alt="stripe" src="../../img/stripe_powered_by.png" height="20px"/>
                                  </a>
                                </label>
                                <div style={this.state.validationHtml.stripe}>
                                  {this.getStripeHtml()}
                                </div>
                              </div>
                            </form>
                          </div>

                          <div class="item" style={{padding:"0"}}>
                            { this.state.userData &&
                              <MealDetail userId={this.state.userData.id} mealTemplateData={PMStore.values}/>
                            }
                          </div>
                          <div class="item" style={{padding:"15px"}}>
                            <h2 class="text-center">
                              Your meal has been successfully posted. We wish a great time!
                            </h2>
                          </div>

                        </div>
                        {this.state.buttonHtml}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              {this.getSubmitButtonModalHandlerHtml()}
            </div>
            );
          }
        }
