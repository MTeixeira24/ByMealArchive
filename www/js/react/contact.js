import React from "react";

export default class contact extends React.Component{
  constructor(){
    super();
  }

  render(){
    return(
      <section id="contact">
        <aside class="bg-dark">
          <div class="container text-center">
            <div class="call-to-action">
              <h2>Get in touch with us!</h2>
              <p>Drop us a line on <a href="mailto:your-email@your-domain.com">{"info@bymeal.com"}</a></p>
            </div>
          </div>
        </aside>
      </section>
    );
  }
}
