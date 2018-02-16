import {EventEmitter} from "events";
import dispatcher from "../dispatcher.js";
import Request from "superagent";
var Config = require('Config');

class SearchMealStore extends EventEmitter{
  constructor(){
    super();
    this.defaultValues = { //Testing purposes only
      title: "Food Subtitle",
      first_name: "John",
      profile_image: "./img/person1.jpg"
    }
    this.MealsFound = [ //TO DO Implement a set function to update this list on server results
      {id:0, lat: 41.158640, long: -8.654308, price: 25, first_name: this.defaultValues.first_name, rating: 5, profile_image: this.defaultValues.profile_image, title: this.defaultValues.title, type:"exp"},
      {id:1, lat: 41.156055, long: -8.638000, price: 10, first_name: this.defaultValues.first_name, rating: 4, profile_image: this.defaultValues.profile_image, title: this.defaultValues.title, type:"exp"},
      {id:2, lat: 41.171563, long: -8.641777, price: 5, first_name: this.defaultValues.first_name, rating: 3, profile_image: this.defaultValues.profile_image, title: this.defaultValues.title, type:"pri"},
      {id:3, lat: 41.162775, long: -8.609848, price: 30, first_name: this.defaultValues.first_name, rating: 2, profile_image: this.defaultValues.profile_image, title: this.defaultValues.title, type:"pri"}
    ]
  }

  getTypeFromResponse(serviceTypeResponse)
  {
    if (serviceTypeResponse.length==1)
    {
      if (serviceTypeResponse[0] == "EXPERIENCE")
      {
        return "exp";
      }
      else {
        return "pri";
      }
    }
    else {
      return "both";
    }
  }
  populateResults(params, callback){
    var url = Config.restRoot + "/meals/";
    var token = localStorage.getItem('token');
    Request
    .get(url)
    .set({'Accept': 'application/json'})
    .end(function(err, res){
        if (res.statusCode < 300)
        {
          var jsonResponse=JSON.parse(res.text);
          var results = jsonResponse.map(function(obj){
            obj["type"] = this.getTypeFromResponse(obj["service_type"]);
            delete obj["service_type"];
            return obj;
          }.bind(this))

          this.MealsFound = results;
          callback(results);
        }
        else
        {
          callback(null)
        }
    }.bind(this))
  }

  getMealsFound(){return this.MealsFound;}

  handleActions(action){
    switch (action.type) {
      case "QUERY":
        if(this.getSearchResults(action.searchparams))
          this.emit("FoundResults");
        else {
          this.emit("NoResultsFound");
        }
        break;
      default:
        break;

    }
  }
}

const searchMealStore = new SearchMealStore;
dispatcher.register(searchMealStore.handleActions.bind(searchMealStore));

export default searchMealStore;
