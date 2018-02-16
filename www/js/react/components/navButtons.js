import React from "react";
import AuthenticationStore from "../../stores/authenticationStore.js";
import {invalidate_token} from "../../actions/authenticationActions.js";
import Modal from 'react-modal';
import { Link } from "react-router";
import { slide as Menu } from 'react-burger-menu'

const burgerMenuStyles = {
  bmBurgerButton: {
    position: 'absolute',
    right: '20px',
    width: '36px',
    height: '30px',
    margin: 'auto',
    top: '0',
    bottom: '0'
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    fontWeight: "700",
    padding: "0.8em",
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)',
    left:0

  }
}

const infoModalStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class nav extends React.Component{

  constructor(){
    super();

    this.state = {notHostModalOpened:false}
    this.handlePostAMealClick = this.handlePostAMealClick.bind(this)
  }

  hostHtml(){
    if(AuthenticationStore.isHost()){
      return(
        <a style={{padding: "0.8em", color: '#b8b7ad', fontWeight: "700"}} href="#/host_preferences">Host</a>
      );
    }
    else {
      return "";
    }
  }

  handlePostAMealClick()
  {
    if (AuthenticationStore.isHost())
    {
      $('.modal-postmeal').modal('show');
    }
    else {
      this.setState({notHostModalOpened:true})
    }
  }

  logout(){
    invalidate_token();
  }

  render(){
    const auth = this.props.auth;
    if(auth == true){
      $('.modal-login').modal('hide');
      $('.modal-signup').modal('hide');
      return(
        <ul class="nav navbar-nav ">

            <Menu styles={burgerMenuStyles} right  >
              <a style={{padding: "0.8em", color: '#b8b7ad', fontWeight: "700", fontSize: "1.15em"}} href="#/preferences">Preferences</a>
              <a style={{padding: "0.8em", color: '#b8b7ad', fontWeight: "700"}} href="#/my_meals">My Meals</a>
              <a style={{padding: "0.8em", color: '#b8b7ad', fontWeight: "700"}} onClick={this.handlePostAMealClick}>Post a meal</a>
              {this.hostHtml()}
              <a style={{padding: "0.8em", color: '#b8b7ad', fontWeight: "700"}} onClick={this.logout.bind(this)}>Sign out</a>
            </Menu>


          <Modal
            isOpen={this.state.notHostModalOpened}
            onRequestClose={ function(){ this.setState({notHostModalOpened: false})}.bind(this) }
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={true}
            style={infoModalStyle}
          >
                <h3>Not yet a Host :(</h3><br/>
                  Looks like you haven&#39;t yet joined our Hosts&#39; community. It&#39;ts amazingly simple, we promise!<br/><br/>
                <div class="text-center">
                  <Link to="become_host" onClick={ function(){ this.setState({notHostModalOpened: false})}.bind(this) }><button>Become a host now!</button></Link>
                </div>


          </Modal>
        </ul>
      );
    }
    else{
      return(
        <ul class="nav navbar-nav navbar-right">
          <li><hr/></li>
        <li>
          <a class="page-scroll"
            onClick={function(){$('.modal-signup').modal('show')}}>Sign up</a>
        </li>
        <li>
          <a class="page-scroll"
            onClick={function(){$('.modal-login').modal('show')}}>
            Log in
          </a>
        </li>
        </ul>
      );
    }
  }
}
