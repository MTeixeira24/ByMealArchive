import {EventEmitter} from "events";
import dispatcher from "../dispatcher.js";
import Request from "superagent";
var Config = require('Config');

class HostStore extends EventEmitter{
  constructor(){
    super();

    this.serviceTypes = {
      "experience": ["EXPERIENCE"],
      "private": ["PRIVATE_DINING"],
      "both": ["EXPERIENCE", "PRIVATE_DINING"]
    };

    this.joiningReasons = {
      "income": ["EXTRA_INCOME"],
      "meet": ["MEET_NEW_PEOPLE"],
      "test": ["TEST_NEW_RECIPES"]
    };

    this.hostingFrequencies = {
      "weekly": "ONCE_A_WEEK",
      "biweekly": "ONCE_EVERY_OTHER_WEEK",
      "monthly": "ONCE_A_MONTH"
    };

    this.typeOfFoods = {
      "local": "LOCAL",
      "mediterranean": "MEDITERRANEAN",
      "italian": "ITALIAN",
      "japanese": "JAPANESE",
      "asian": "ASIAN",
      "vegan": "VEGAN",
      "other": "OTHER"
    };

    this.venueTypes = {
      "dinRoom": "DINING_ROOM",
      "kitchen": "KITCHEN",
      "backyard": "BACKYARD",
      "terrace": "TERRACE",
      "other": "OTHER"
    };

    this.amenitiesTypes = {
      "petFriendly": "PET_FRIENDLY",
      "easyTransport": "PUBLIC_TRANSPORTATION",
      "freePark": "FREE_PARKING",
      "allowSmoking": "SMOKING",
      "wifi": "WIFI",
      "other": "OTHER"
    };
  }


  handleActions(action){
    switch (action.type) {
      case "ONBOARD": {
        const url = Config.restRoot + "/hosts/"
        const user_email = action.email;
        const description = action.description;
        const features = action.features;
        const arrival_instructions = action.instructions;
        const service_type = this.serviceTypes[action.service_type];
        const joining_reason = this.joiningReasons[action.joining_reason];
        const hosting_frequency = this.hostingFrequencies[action.hosting_frequency];
        const type_of_food = action.type_of_food.map(function(food) { return this.typeOfFoods[food]; }, this );
        const lat = action.lat;
        const lon = action.lon;
        const amenities = action.amenities.map(function(amenity) { return this.amenitiesTypes[amenity]; }, this );
        const venue_type = this.venueTypes[action.venue_type];
        const venue_images = this.venue_images;
        Request
        .post(url)
        .send({
            user_email,
            description,
            features,
            arrival_instructions,
            service_type,
            joining_reason,
            hosting_frequency,
            type_of_food,
            lat,
            lon,
            amenities,
            venue_type,
            venue_images
        })
        .set('Accept', 'application/json')
        .end(function(err, res){
        }.bind(this))
        break;
    	}
      case "ASSOCIATE_STRIPE": {
        var hostId = action.hostId;
        if (hostId == -1)
        {
          localStorage.setItem('stripe', "error")
        }
        var token = localStorage.getItem('token');
        var stripe_token = action.token;
        var url = Config.restRoot + "/hosts/" + hostId + "/"
        Request
        .put(url)
        .send({
            stripe_token
        })
        .set({'Authorization': 'Bearer '+token, 'Content-Type':'application/x-www-form-urlencoded'})
        .set('Accept', 'application/json')
        .end(function(err, res){
          if (res.statusCode < 300)
          {
            localStorage.setItem('stripe', stripe_token)
          }
          else
          {
          }
        }.bind(this))


        break;
    	}
      case "UPDATE_HOST":{
        const url = Config.restRoot + "/venues/"+action.id+"/";
        const urlhost = Config.restRoot + "/hosts/"+action.hostid+"/";
        var token = localStorage.getItem('token');
        Request
        .put(url)
        .send({
          arrival_instructions : action.instructions,
          lat: action.lat,
          lon: action.lon,
          amenities: action.amenities.map(function(am){return this.amenitiesTypes[am]}.bind(this)),
          venue_type: this.venueTypes[action.venue_type],
          venue_images: action.venue_images
        })
        .set({'Authorization': 'Bearer '+token})
        .set({'Accept': 'application/json'})
        .end(function(err, res){
            if(err < 400){
              Request
              .put(urlhost)
              .send({
                description: action.description
              })
              .set({'Authorization': 'Bearer '+token})
              .set({'Accept': 'application/json'})
              .end(function(err, res){
                action.callback(err,res);
              })
            }else
              action.callback(err,res);
        })
        break;
      }
	  }
	}
}

const hostStore = new HostStore;
dispatcher.register(hostStore.handleActions.bind(hostStore));

export default hostStore;
