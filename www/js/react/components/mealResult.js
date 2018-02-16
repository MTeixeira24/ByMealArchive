import React from "react";
export default class MealResult extends React.Component{
  constructor(){
    super();
  }

  displayStars(rating){
    var stars = "";
    for(var i = 0; i < rating; i++)
      stars = stars.concat(String.fromCharCode(9733));
    return(stars+rating)
  }

  render() {

    let result = this.props.result;
    return (<div class = "col-md-3 text-center" style = {{
        backgroundImage:"url(" + result.photos[0] +")",
        backgroundSize: "cover",
        margin: "20px",
        borderRadius: "25px",
        width: "250px",
        height: "200px",
        color: "white",
        boxShadow: this.props.activatedShadow,
        overflow: "hidden"
      }}
      onClick={ this.props.onClick }
       >
      <br/>
      <div class="row">
      {(result.type == "exp" || result.type == "pri") &&
      <div style={{
        backgroundColor: "rgba(200,200,200,0.7)",
        width: "50px",
        height: "30px"
      }} class="col-md-6 left">

      <img src = {"../../../img/"+result.type+".png"} style={{width:"150%"}}/>
      </div>
      }
      <div style={{
        backgroundColor: "rgba(200,200,200,0.7)",
        width: "50px",
        height: "30px",
        position: "absolute",
        right: "0"
      }} class="col-md-6">
      <span style={{position:"absolute", top:"4px", right:"1px"}}><b>{result.price}€</b></span>
      </div>
      </div>
      <div style={{marginTop: "-10px"}}>
      <div class="thumbnail" style={{
        display:"inline-block",
        height: "55px",
        width: "65px",
        borderRadius:"50%",
        backgroundImage: "url("+result.profile_image+")",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        marginBottom:"-10px",
        marginRight:"30px",
        borderStyle: "solid",
        borderColor: "white",
        borderWidth: "3px"
      }}></div>
      <h4><b>
        <span style={{
          backgroundColor: "rgba(200,200,200,0.9)",
        }}>
        <b>{result.first_name}</b>
        </span>


        {result.rating && this.displayStars(result.rating)}</b></h4>

      <p><span style={{
        backgroundColor: "rgba(200,200,200,0.9)",
      }}>{result.title}</span></p>
      <div style={{
        backgroundColor: "rgba(255, 125,0,0.7)",
        marginTop: "-15px",
        width: "250px",
        position: "relative",
        right: "15px"
      }}>
      <p>Book Now</p>
      </div>
      </div>
      </div>)
    }
}
