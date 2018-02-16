import React from "react";
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
import * as SMActions from "../../actions/searchMealAction.js";
import SMStore from "../../stores/searchMealStore.js";
import MealResult from "../components/mealResult.js";
import MealDetail from "../components/mealDetail.js"
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
    overflowX            : 'hidden'
  }
};


const coords = {
  lat: 51.5258541,
  lng: -0.08040660000006028
};

const params = {v: '3.exp', key: 'AIzaSyDTm73KUiiVgqgizfkY24TvGA_BxDIOkvs'}; //Currently using my personal key


export default class SearchMeal extends React.Component{
  constructor(){
    super();
    this.state={
      activeTab      : -1,
      filter         : 0,
      MealsFound     : [],
      mealDetailOpen : false
    };
  }

  componentWillMount(){

    SMStore.populateResults(null, function()
    {
      this.setState({MealsFound : SMStore.getMealsFound()})
    }.bind(this));
  }

  activeTable(Id){
    var active = Id == this.state.activeTab ? "0px 0px 20px 5px orange" :  "";
    return active;
  }

  updateActiveTable(Id){
    document.location.hash = Id;
    this.setState({activeTab: Id});
    document.location.hash = "#/searchmeal";
    this.setState({mealDetailOpen:true});
  }

  filterResults(num){
    this.setState({filter: num});
  }

  getFilterStyle(num){
    switch (num) {
      case 0:
        if(this.state.filter == 0)
          return {borderWidth: "3px", borderColor: "black", borderStyle: "solid"}
        else
          return {}
        break;
      case 1:
        if(this.state.filter == 1)
          return {borderWidth: "3px", borderColor: "black", borderStyle: "solid", width:"33%", margin:"10px"}
        else
          return {width:"33%", margin:"10px"}
        break;
      case 2:
        if(this.state.filter == 2)
          return {borderWidth: "3px", borderColor: "black", borderStyle: "solid", width:"33%"}
        else
          return {width:"33%"}
        break;
      default:

    }
  }

  getHtmlSearchResults(){
    const filter = this.state.filter;
    let results = [];
    if(filter == 0){
      results = this.state.MealsFound;
    }
    else{
      var sFilter = "";
      if(filter == 1)
        sFilter = "exp"
      else
        sFilter = "pri"
      results = []
      for(var i = 0; i < this.state.MealsFound.length; i++){
        if(this.state.MealsFound[i].type == sFilter)
          results.push(this.state.MealsFound[i])
      }
    }
    return (results.map((result, index) =>
        <MealResult
          result={result}
          onClick={() => this.updateActiveTable(index)}
          id={index.toString()}
          key={index}
          activatedShadow={this.activeTable(index)}/> ));
  }

  getMapMarkers(){
    const filter = this.state.filter;
    let results;
    if(filter == 0){
      results = this.state.MealsFound;
    }
    else{
      var sFilter = "";
      if(filter == 1)
        sFilter = "exp"
      else
        sFilter = "pri"
      results = []
      for(var i = 0; i < this.state.MealsFound.length; i++){
        if(this.state.MealsFound[i].type == sFilter)
          results.push(this.state.MealsFound[i])
      }
    }
    var mealMarkers = results.map((result, index) =>
      <Marker key={index}
        lat={result.approximate_lat}
        lng={result.approximate_lon}
        draggable={false}
        onClick={() => this.updateActiveTable(index)} />
    );
    return mealMarkers;
  }

  getMapCenter(coord){
    if(this.state.activeTab == -1){
      if(coord == "lat") return "41.157944";
      else return "-8.629105";
    }
    else{
      if(coord == "lat") return this.state.MealsFound[this.state.activeTab].approximate_lat;
      else return this.state.MealsFound[this.state.activeTab].approximate_lon;
    }
  }

  infoWindow(){
    if(this.state.activeTab != -1){
      const meal = this.state.MealsFound[this.state.activeTab];
      return(
        <InfoWindow
          lat={meal.approximate_lat}
          lng={meal.approximate_lon}
          pixelOffset={new google.maps.Size(0, -40)}
          content={meal.first_name} />
      );
    }else return "";
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true,
      scrollwheel: true,
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: true
    });
  }

  onDragEnd(e) {
    console.log('onDragEnd', e);
  }

  onCloseClick() {
    console.log('onCloseClick');
  }

  onClick(e) {
    console.log('onClick', e);
  }

  render(){
    return(
      <div class="resTable">
       {/* <link rel="stylesheet" type="text/css" href="./css/searchmeal.css" /> */}
        <div style={{width:"100%", marginTop:"50px"}} class="row">
          <div class="col-md-6 left">
            <div>
              <h3>Filter by type:</h3>
              <div class="text-center">
                <button onClick={() => this.filterResults(0)} style={this.getFilterStyle(0)} class="btn btn-lg">
                  <h3>All</h3>
                </button>
                <button onClick={() => this.filterResults(1)} class="btn btn-lg" style={this.getFilterStyle(1)}>
                  <img class="pull-left" src = "../../../img/exp.png" style={{width:"20%"}}/>
                    <h4>Experience</h4>
                    <h6>Join the host</h6>
                </button>
                <button onClick={() => this.filterResults(2)} class="btn btn-lg" style={this.getFilterStyle(2)}>
                  <img class="pull-left" src = "../../../img/pri.png" style={{width:"30%"}}/>
                  <div class="text-center">
                  <h4>Private Dining</h4>
                  <h6>Invite your friends</h6>
                  </div>
                </button>
              </div>
            </div>
            <hr/>
            <h3> Search Results</h3>
            <div class = "row" style={{marginLeft: "10px"}}>
              {this.getHtmlSearchResults()}
            </div>


          </div>
          <div class="col-md-6 no-flow">
            <div style={{minHeight:"100%", height:"100%"}}>
              <Gmaps
                width={'100%'}
                height={'700px'}
                lat={this.getMapCenter("lat")}
                lng={this.getMapCenter("long")}
                zoom={12}
                loadingMessage={'Loading map...'}
                params={params}
                onMapCreated={this.onMapCreated}>
                {this.getMapMarkers()}
                {this.infoWindow()}
              </Gmaps>
            </div>
          </div>
        </div>

        <Modal
          isOpen={this.state.mealDetailOpen}
          onRequestClose={ function(){ this.setState({mealDetailOpen: false})}.bind(this) }
          contentLabel="MealDetail"
          shouldCloseOnOverlayClick={true}
          style={mealDetailModelStyle}
        >
          {this.state.activeTab != -1 &&
          <div>
          <div className="modal-header">
            <button type="button" className="close" onClick={ function(){ this.setState({mealDetailOpen: false})}.bind(this) }>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <MealDetail
            userId={this.state.MealsFound[this.state.activeTab].user_id}
            mealId={this.state.MealsFound[this.state.activeTab].id}
            booking={true}
            closeMealDetail={function(){ this.setState({mealDetailOpen: false})}.bind(this)}
          />
          </div>
          }
        </Modal>

      </div>

    );
  }
}
