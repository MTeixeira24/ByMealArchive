import {EventEmitter} from "events";
import dispatcher from "../dispatcher.js";
import Request from "superagent";
var Config = require('Config');
import moment from 'moment';
import AuthenticationStore from "./authenticationStore.js";

class BookMealStore extends EventEmitter{
  constructor(){
    super();

  }

  handleActions(action){
    switch (action.type) {
      case "MAKE_BOOK_REQUEST":{
        var data = JSON.parse(JSON.stringify(action.data))
        data['date'] = moment(data['date']).format('YYYY-MM-DD')
        data['meal'] = action.mealId;
        var url = Config.restRoot + "/book_requests/";
        var token = localStorage.getItem('token');
        Request
        .post(url)
        .send(data)
        .set({'Authorization': 'Bearer '+token, 'Content-Type':'application/x-www-form-urlencoded'})
        .set({'Accept': 'application/json'})
        .end(function(err, res){
          if (res.statusCode < 300)
          {
            action['callbackSuccess']();
          }
          else
          {
            action['callbackError']();
          }
        }.bind(this))
        break;
      }
      case "GUEST_MEALS":
      {
        this.getTableData(action['callbackSuccess'], action['callbackError'])
        break;
      }
      case "PAY":
      {
        this.pay(action['cardToken'], action['requestId'],action['callbackSuccess'], action['callbackError'])
        break;
      }
    }
  }

  pay(card_token, requestId, callbackSuccess, callbackError)
  {
    var token = localStorage.getItem('token');
    var url = Config.restRoot + "/book_requests/" + requestId + "/";
    Request
    .put(url)
    .send({
      card_token
    })
    .set({'Authorization': 'Bearer '+token, 'Content-Type':'application/x-www-form-urlencoded'})
    .set('Accept', 'application/json')
    .end(function(err, res){
      if (res.statusCode < 300)
      {
        console.log("res = ", res.text)
      }
      else
      {
      }
    }.bind(this))
  }

  getTableData(callbackSuccess, callbackError)
  {
    var url = Config.restRoot + "/book_requests/";
    var token = localStorage.getItem('token');
    var tableData = []
    Request
    .get(url)
    .set({'Authorization': 'Bearer '+token, 'Content-Type':'application/x-www-form-urlencoded'})
    .set({'Accept': 'application/json'})
    .end(function(err, res){
      if (res.statusCode < 300)
      {
        let requests = JSON.parse(res.text)
        if (requests.length == 0)
        callbackSuccess(requests)
        for (var i = 0; i < requests.length; i++) {
          let request = requests[i];
          let tableEntry = {date: request.date,
            status: request.status,
            requestId: request.id,
            guests: request.guests}
            AuthenticationStore.getResouceDetails("meals", request.meal, function(mealData){
              tableEntry["mealTitle"] = mealData.title;
              tableEntry["mealId"] = mealData.id;
              tableEntry["description"] = mealData.description;
              tableEntry["price"] = mealData.price;
              tableEntry["mealPhotos"] = mealData.photos;
              AuthenticationStore.getResouceDetails("hosts", mealData.host, function(hostsData){
                AuthenticationStore.getResouceDetails("users", hostsData.user, function(usersData){
                  tableEntry["hostId"] = usersData.id;
                  tableEntry["first_name"] = usersData.first_name;
                  tableEntry["profile_image"] = usersData.profile_image;
                  tableData.push(tableEntry)
                  if ( i == requests.length)
                  callbackSuccess(tableData);
                }.bind(this))
              }.bind(this))
            }.bind(this))
          }
        }
        else
        {
          callbackError()
        }
      }.bind(this))
    }
  }

  const bookMealStore = new BookMealStore;
  dispatcher.register(bookMealStore.handleActions.bind(bookMealStore));

  export default bookMealStore;
