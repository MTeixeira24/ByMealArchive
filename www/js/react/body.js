import React from "react";

export default class body extends React.Component{
  render(){
    return(
      <section id="services">
        <div class="container">
          <div class="row">
            <div class="col-lg-12 text-center">
              <h1 class="section-heading"><b>How it works</b></h1>
              <hr class="primary"/>
            </div>
          </div>
        </div>
        <div class="container">

          <div class="row">
            <div class="col-lg-4 text-center">
              <div class="service-box">
                <div class="row">
                  <div class="col-xs-4 text-center"> </div>
                  <div class="col-xs-4 text-center">
                    <img style={{WebkitFilter: "opacity(30%)", filter: "opacity(30%)",}} src="img/search.png" class="img-responsive" alt=""/>
                  </div>
                  <div class="col-xs-4 text-center"> </div>
                </div>
                <h2 style={{color:"#F05F40"}}><b>Search</b></h2>
                <p style={{fontSize: "20px"}}>Search your meal.</p>
              </div>
            </div>
            <div class="col-lg-4 text-center">
              <div class="service-box">

                <div class="row">
                  <div class="col-xs-4 text-center"> </div>
                  <div class="col-xs-4 text-center">
                    <img style={{WebkitFilter: "opacity(30%)", filter: "opacity(30%)",}} src="img/book.svg" class="img-responsive" alt=""/>
                  </div>
                  <div class="col-xs-4 text-center"> </div>
                </div>
                <h2 style={{color:"#F05F40"}}><b>Book</b></h2>
                <p style={{fontSize: "20px"}}>Book with your host.</p>
              </div>
            </div>
            <div class="col-lg-4 text-center">
              <div class="service-box">

                <div class="row">
                  <div class="col-xs-4 text-center"> </div>
                  <div class="col-xs-4 text-center">
                    <img style={{WebkitFilter: "opacity(30%)", filter: "opacity(30%)",}} src="img/enjoy.svg" class="img-responsive" alt=""/>
                  </div>
                  <div class="col-xs-4 text-center"> </div>
                </div>
                <h2 style={{color:"#F05F40"}}><b>Enjoy!</b></h2>
                <h2><p style={{fontSize: "20px"}}>Taste a delicious treat prepared just for you and meet people underway!</p></h2>

                </div>
              </div>
            </div>

          </div>
        </section>

    );
  }
}
