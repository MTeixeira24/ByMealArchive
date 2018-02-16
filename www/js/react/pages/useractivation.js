import React from "react";
import Request from "superagent"
var Config = require('Config');

export default class UserAccountActivation extends React.Component{
  constructor(){
    super();

    this.state = {};
  }

  componentWillMount(){
  	const {user, code} = this.props.params;
  	var url = Config.restRoot + "/users/activate/";
  	Request
  	.post(url)
  	.send({user_email: user, code: code})
  	.set('Accept', 'application/json')
   	.end(function(err, res){
     	this.setState({
     		response: res.body,
     		status: res.status
   		});
	}.bind(this))
 }

  render(){

    return(
      <section>
        <aside class="bg-dark">
          <div class="container text-center">
            <div class="call-to-action">
              {this.state.response}
            </div>
          </div>
        </aside>
      </section>
    );
  }
}
