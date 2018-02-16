import React from "react";
import AuthenticationStore from "../../stores/authenticationStore.js";
import HostStore from "../../stores/hostStore.js";
import {updatePreferences} from "../../actions/hostActions.js"
import '../../../css/preferences.css'

export default class Preferences extends React.Component{
  constructor(){
		super();
		this.authenticated = this.authenticated.bind(this);
        this.state = {
          authenticated: false,
          mouseInsideImage: false,
          mousePressed: false,
          moveX: 50,
          moveY: 50,
          file: '',
          imagePreviewUrl: '',
          firstName: '',
          lastName: '',
          email: '',
            bday_day: 1,
            bday_month: 'january',
            bday_year: 1900,

        };
        this.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        this.months= ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        this.years = this.getYearList();
        this.xStart = 0;
        this.yStart = 0;
        this.currX = 50;
        this.currY = 50;
        this.imageSizeX = 0;
        this.imageSizeY = 0;

        this.handleInput = this.handleInput.bind(this);
        this.setUserData = this.setUserData.bind(this);
	}

  setUserData(userDetails)
  {
    var userDetails = AuthenticationStore.userDetail.loggedUserData;
    var birthdate = userDetails.birth_date.split("-");
    delete userDetails['birth_date']
    var dateInfo = {day: birthdate[2], month: this.months[parseInt(birthdate[1]) -1], year:birthdate[0] };
    userDetails['birthday'] = dateInfo;

    this.setState({firstName: userDetails.first_name, lastName: userDetails.last_name, email: userDetails.email, bday_day: userDetails.birthday.day, bday_month: userDetails.birthday.month, bday_year: userDetails.birthday.year});

    this.checkFebruary();
  }

  componentWillMount() {
    this.setState({authenticated: AuthenticationStore.isAuthenticated()});

    if (!AuthenticationStore.userDetail.loggedUserData)
    {
      AuthenticationStore.getLoggedUserData(
        function(data){
          this.setUserData(data);
        }.bind(this)
      )
    }
    else {
      this.setUserData(AuthenticationStore.userDetail.loggedUserData);
    }
  }

	componentDidMount(){
	  AuthenticationStore.on("authChange", this.authenticated);
	}
  componentWillUnmount(){
	  AuthenticationStore.removeListener("authChange", this.authenticated);
	}

	authenticated(){
	  this.setState({authenticated: AuthenticationStore.isAuthenticated()});
	}

  setMouseInsideImage(val){
    this.setState({mouseInsideImage: val})
  }
  setMouseDown(xcoord, ycoord){
    this.setState({mousePressed: true});
    this.xStart = xcoord;
    this.yStart = ycoord;
  }
  setMouseUp(){
    this.setState({mousePressed: false});
    this.currX = this.state.moveX;
    this.currY = this.state.moveY;
  }
  moveImage(xcoord, ycoord){
    var prevX = 0, prevY = 0;
    if(this.state.mouseInsideImage && this.state.mousePressed && this.state.imagePreviewUrl){
      prevX = (this.currX + (xcoord - this.xStart));
      prevY = (this.currY + (ycoord - this.yStart));
      if(prevX < 100 && prevX > 0 && prevY < 100 && prevY > 0 )
        this.setState({
          moveX: prevX,
          moveY: prevY
        });
    }
  }

  handleImageSelect(e){
    console.log("A file has been submitted!")
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
      var img = new Image();
      img.onload = function(){
        this.imageSizeX = img.width;
        this.imageSizeY = img.height;
      }.bind(this);
      img.src = reader.result;
    }
    reader.readAsDataURL(file);
  }

  handleSubmit(e){
    updatePreferences(this.state.file, this.state.moveX, this.state.moveY)
  }



  handleInput(event,input){
        switch(input){
            case "fName":{
                this.setState({firstName: event.target.value});
                break;
            }
            case "lName":{
                this.setState({lastName: event.target.value});
                break;
            }
            case "mail":{
                this.setState({email: event.target.value});
                break;
            }
        }

    }

    componentWillUpdate(nextProps, nextState){
        if (nextState.bday_month==='february'){
            this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];

        }else if (nextState.bday_month=='january' || nextState.bday_month=='march' || nextState.bday_month=='may' || nextState.bday_month=='july' || nextState.bday_month=='august' || nextState.bday_month=='october' || nextState.bday_month=='december'){
            this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        }else{
            this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        }

        if ((nextState.bday_year%4 == 0) && (nextState.bday_month==='february')){
            this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];


        }
    }


    getYearList(){
        let array=[];
        let actDate = new Date().getFullYear();
        let startDate = 1800;
        while(startDate!==actDate){
            array.push(startDate);
            startDate++;
        }
        array.push(startDate);
        return array;

    }



    handleDate(event,val){
        switch (val){
            case 'day':{
                this.setState({bday_day: event.target.value});

                break;
            }
            case 'month':{
                this.setState({bday_month: event.target.value});


                break;
            }
            case 'year':{
                this.setState({bday_year: event.target.value});
                break
            }
        }
    }

    checkFebruary(){
        if (this.state.bday_month==='february'){
            this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
            this.state.bday_day > 29 ? this.setState({validDate: false}) : this.setState({validDate: true});
            console.log('here');
        }else{
            this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
            this.setState({validDate: true});
        }
        if ((this.state.bday_year%4 == 0) && (this.state.bday_year%400 == 0) && (this.state.bday_month==='february')){
            this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
            this.state.bday_day > 28 ? this.setState({validDate: false}) : this.setState({validDate: true})
            console.log('here 2');
        }
    }

  render(){


    let $imageSource = null;
    if(this.state.imagePreviewUrl)
      $imageSource = "url("+this.state.imagePreviewUrl+")";
    else
      $imageSource = "url(http://placehold.it/350x350)"; //Replace with a No Image Selected image.

    return(
        <div style={{width:"100%", marginTop:"50px"}}>

                <h2> Preferences</h2>
                <div className="row">
                    <div className="col-md-6 text-center">

                        <h2>Public Profile</h2>

                        <div className="row imgBox">
                            <div className="col-md-6">
                                <br/>
                                <h3>Public Photo</h3>
                                <div style={{
                                    display:"inline-block",
                                    height: "150px",
                                    width: "150px",
                                    borderRadius:"100%",
                                    backgroundColor: "white",
                                    backgroundImage: $imageSource,
                                    backgroundRepeat: "no-repeat",
                                    marginBottom:"0px",
                                    marginLeft: " 0px",
                                    borderStyle: "solid",
                                    borderColor: "blacks",
                                    borderWidth: "2px",
                                    backgroundPosition: this.state.moveX+"%"+" "+this.state.moveY+"%",
                                    cursor: "all-scroll"
                                    }} id="imagePreview"
                                    onMouseEnter={() => this.setMouseInsideImage(true)}
                                    onMouseLeave={() => this.setMouseInsideImage(false)}
                                    onMouseDown={e => this.setMouseDown(e.clientX, e.clientY)}
                                    onMouseUp={() => this.setMouseUp()}
                                    onMouseMove={e => this.moveImage(e.clientX, e.clientY)}>
                                </div>

                            </div>
                            <div className="col-md-6" style={{marginLeft: -80}}>
                                <p>Its important to upload a picture of you.<br/>Showing your face gives familiarity to guests</p>
                                <br/>
                                <form>
                                    <label className="btn btn-default btn-file publicInfoBtn" >
                                        Select an image <input onChange={(e) => this.handleImageSelect(e)} type="file" style={{display: "none"}}/>
                                    </label>
                                    <label className="btn btn-default publicInfoBtn" style={{marginLeft: "1%"}}>
                                        Upload Image! <input onSubmit={(e) => this.handleSubmit(e)} type="submit" style={{display: "none"}}/>
                                    </label>
                                </form>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-6 privateInfo" style={{paddingRight: "5%"}}>
                        <h2>Private Info</h2><br/>
                        <form>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name:</label>
                                <input value={this.state.firstName} type="firstName" className="form-control" id="fname" onChange={(e)=>this.handleInput(e,"fName")}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name:</label>
                                <input value={this.state.lastName} type="lastName" className="form-control" id="lname" onChange={(e) => this.handleInput(e,"lName")}/>
                                <p>Your public profile will only show your first name</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">E-Mail Address:</label>
                                <input value={this.state.email} type="email" className="form-control" id="mail" onChange={(e) => this.handleInput(e,"mail")}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Password: </label>
                                 <a>  Click here to change password</a>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Birth Date:</label>
                                <div className="datePicker">
                                    <select value={this.state.bday_day} onChange={(e)=> this.handleDate(e,'day')}>
                                        {this.days.map(function(day){
                                            return <option value={day} key={day}>{day}</option>
                                        },this)}
                                    </select>

                                    <select value={this.state.bday_month} onChange={(e)=> this.handleDate(e,'month')}>
                                        {this.months.map(function(month){
                                            return <option value={month} key={month}>{month}</option>
                                        },this)}
                                    </select>

                                    <select value={this.state.bday_year} onChange={(e)=> this.handleDate(e,'year')}>
                                        {this.years.map(function(year){
                                            return <option value={year} key={year}>{year}</option>
                                        },this)}
                                    </select>

                                    {(new Date().getFullYear() - this.state.bday_year )>=18 ? <img src="https://4.bp.blogspot.com/-Kxsrahxeh28/V68zwyt-1oI/AAAAAAAABDQ/Ynm9KgA3KTwMRIZj9SkrbhEqZFx7gJl0QCLcB/s1600/14.png"/> : <p>You must have 18 or above</p>}
                                </div>

                            </div>
                            <button type="submit" className="btn btn-success sub">Submit changes</button>

                        </form>
                    </div>
                </div>
            </div>
    )
  }
}
