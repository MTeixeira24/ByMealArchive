import {EventEmitter} from "events";
import dispatcher from "../dispatcher.js";
import Request from "superagent";
var Config = require('Config');

class PostMealStore extends EventEmitter{
  constructor(){
    super();
    this.values = {
      title:"",
      service_type:["EXPERIENCE", "PRIVATE_DINING"],
      description: "",
      photos: [],
      tags: [],
      menu: [],
      guests: 1,
      price: 1,
      paymentMethod: ""
    }
  }

  handleActions(action){
    switch (action.type) {
      case "SAVEINFO":
      this.values[action.id] = action.value;
        switch (action.id) {
          case "description":
            this.values.description = action.value;
            break;
          case "imageUpload":
            this.values.image = action.value;
            break;
          case "countrySelect":
            this.values.country = action.value;
            break;
          case "addressSelect":
            this.values.address = action.value;
            break;
          case "type":
            this.values.type = action.value;
            break;
          case "tags":
            this.values.tags = action.value;
            break;
          case "price":
            this.values.price = action.value;
            break;
          case "paymentMethod":
            this.values.paymentMethod = action.value;
            break;
        }
        this.emit("save_info");
        break;
    }
  }

  getValues(){return this.values;}

  postMeal(callbackSuccess, callbackError)
  {
    var url = Config.restRoot + "/meals/";
    var token = localStorage.getItem('token');
    Request
    .post(url)
    .set( {'Authorization': 'Bearer '+token})
    .set({'Accept': 'application/json'})
    .send( this.values )
    .end(function(err, res){
        if (res.statusCode < 300)
        {
          callbackSuccess();
        }
        else
        {
          callbackError();
        }
    });
  }
}

const postMealStore = new PostMealStore;
dispatcher.register(postMealStore.handleActions.bind(postMealStore));

export default postMealStore;
