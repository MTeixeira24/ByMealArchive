import React,{Component} from 'react';
import AuthenticationStore from '../../stores/authenticationStore';
import SMStore from '../../stores/searchMealStore';
import MealResult from "../components/mealResult";
export default class Hosts extends Component{


    constructor(props){
        super(props);
        this.months= ['January','February','March','April','May','June','July','August','September','October','November','December'];

        this.mock={
            fname: 'Joana',
            image: 'https://placehold.it/300x300',
            description: 'awdawdw',
            joined: '06/07/2014'
        }


        this.state ={
            user: {
                first_name: '',
                date_joined:'',
                host:{},

            },
            clientMeals: []
        }
    }

    componentWillMount() {

        //getting the user associated with the id on the url .../hosts/xxxxxxx
        AuthenticationStore.getResouceDetails("hosts", this.getId(), (data) => {
            AuthenticationStore.getResouceDetails("users", data.user, (uData) => {

                //getting the meals associated with the client
                SMStore.populateResults(null, (() => {
                    console.log(SMStore.getMealsFound());
                    this.setState({
                        clientMeals: SMStore.getMealsFound().filter(((elem) => {
                            return (elem.id === uData.id);
                        })), user: uData});
                }));
            });
        });


    }




    //extract the id from the url
    getId(){
        return window.location.href.replace(/^https?:\/\//,'').split('/')[3];
    }

    render(){
        return(
            <div style={{marginTop: 70}}>
                <h3 class="text-center" style={{width:'100%'}}>Public Profile</h3>
                <div class="row" style={{width:'90vw',marginLeft:'5vw',minHeight:'80vh',backgroundColor: '#efefef',borderRadius: 5}}>
                    <div class="col-md-2">
                        <img src={this.state.user.profile_image} style={{width:'140px',height:'140px',marginTop:20,borderRadius: '100%'}}/>
                    </div>
                    <div class="col-md-10">
                        <h3 style={{paddingTop:65}}><b>{this.state.user.first_name}</b>, joined in  {this.months[this.state.user.date_joined.split('-')[1]-1]} {this.state.user.date_joined.split('-')[0]}</h3>
                        <h3 style={{paddingTop: 60}}>Description</h3>
                        <p style={{height: '70%'}}>
                            {this.state.user.host.description}
                        </p>
                        <div class="row">
                            {this.state.clientMeals.map((elem)=>{
                                return (<MealResult
                                    result={elem}
                                    onClick={console.log("pressed")}
                                />);
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}