import React from "react";
import Request from "superagent"
import * as HostActions from "../../actions/hostActions.js";
import AuthenticationStore from "../../stores/authenticationStore.js";

export default class UserAccountActivation extends React.Component{
  constructor(){
    super();

    this.state = {message:""};
  }

  associate(hostId)
  {
    var stripeResponse = this.props.location.query
    if ("code" in stripeResponse){
      HostActions.associateStripe(stripeResponse["code"], hostId)
      this.setState({message:
        (
          <div>
            Stripe has been successfully associated with ByMeal.com!
            <br/>
            You can now go back to the previous tab to complete your meal!
            <br/>

          </div>)})
        }
        else {
          this.setState({message:
            (
              <div>
                It looks we were not able to successfully associate your account on Stripe.
                <br/>
                Please try again, as you will not be able to receive any payments.
              </div>)})
              HostActions.associateStripe("error", -1)
            }
          }
          componentWillMount(){
            let hostId
            if (!AuthenticationStore.userDetail.loggedUserData)
            {
              AuthenticationStore.getLoggedUserData(
                function(data){
                  this.associate(data.host.id);
                }.bind(this)
              )
            }
            else {
              this.associate(AuthenticationStore.userDetail.loggedUserData.host.id);
            }
          }

          render(){
            return(
              <section>
                <aside class="bg-dark">
                  <div class="container text-center">
                    <div class="call-to-action">
                      {this.state.message}
                    </div>
                  </div>
                </aside>
              </section>
            );
          }
        }
