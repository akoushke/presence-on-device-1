import React, {Component} from 'react';
import Webex from 'webex';
import moment from 'moment';
import axios from 'axios';
import {Button, Icon, Spinner, Avatar} from '@momentum-ui/react';
import Content from './Content';
import { v4 as uuidv4 } from 'uuid';
import AuthModal from './AuthModal';
import { io } from "socket.io-client";
import queryString from 'querystring';
import { client_id, client_secret, auth_url, server_url, redirect_uri } from '../constants';
import gif from '../images/bear.gif';

declare type Props = null;

export default class App extends Component {
  state: any;
  webex: any;
  props: any;
  token: string;
  socket: any;
  loginState: string;
  code: string;
  urlState: string;

  constructor(props: Props) {
    super(props);
    this.code = new URLSearchParams(window.location.search).get("code");
    this.urlState = new URLSearchParams(window.location.search).get("state");
    this.loginState = uuidv4();
    this.socket = io(server_url);
    this.token = "";
    this.state = {
      isWebexConnected: false,
      isTokenValid: !!this.code,
      displayAuthPrompt: false
    };
  }

  async componentDidMount() {
    if(this.code) {
      const {data} = await axios.post(auth_url, queryString.stringify({
        code: this.code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
        client_id: client_id,
        client_secret: client_secret
      }), 
      {
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if(this.urlState) {
        this.setState({displayAuthPrompt: true});
        const socket = io(server_url);
        data.state = this.urlState;
        socket.emit('token', data);
      } else {
        this.setState({isTokenValid: true});
        this.storeToken(data);
        await this.connect(data.access_token);
        window.history.pushState({}, document.title, "/presence-on-device");
      }
    } else if(localStorage.getItem('webex_token')) {
      await this.validateToken();
      await this.connect(localStorage.getItem('webex_token'));

    } else {
      this.socket.emit('register', this.loginState);

      this.socket.on('token', async (token) => {
        this.setState({isTokenValid: true});
        this.storeToken(token);
        await this.connect(token.access_token);
      });
    }
  }
  
  async connect(token: string): Promise<void> {
    try {
      this.webex = new Webex({ credentials: token});
      // await this.webex.internal.device.register();
      await this.webex.internal.mercury.connect();

      this.setState({isWebexConnected: true});
    } catch (error) {
      console.log(error);
    }
  }

  storeToken({expires_in, access_token, refresh_token}) {
    const startDate = moment.utc();
    const expirationDate = startDate.add(Number(expires_in), 'seconds');
    
    localStorage.setItem('webex_token', access_token);
    localStorage.setItem('expiration_date', expirationDate.format());
    localStorage.setItem('refresh_token', refresh_token);
  }

  async requestForFreshToken() {
    const refresh_token = localStorage.getItem('refresh_token');

    try {
      const {data} = await axios.post(auth_url, queryString.stringify({
        grant_type: "refresh_token",
        client_id: client_id,
        client_secret: client_secret,
        refresh_token
      }), 
      {
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      
      this.storeToken(data);
    } catch (error) {
      console.log(error);
    }

  };

  async validateToken() {
    if((moment(localStorage.getItem('expiration_date')).diff(moment.utc()) < 0)) {
      await this.requestForFreshToken();
    } else {
      this.setState({isTokenValid: true});
    }
  }


  render(): JSX.Element {
    const authSuccessful = <div>
      <h4>Login Completed Successfully!</h4>
      <p>You may now close this tab!</p>
    </div>;

    const loading = <div className='bear'>
      <p className='bearContent'>Initial load may take a bit longer. </p>
      <img src={gif} />
    </div>

    return <>
      {this.state.displayAuthPrompt ?
        authSuccessful :
        <div>
          {!this.state.isTokenValid ? 
            <AuthModal loginState={this.loginState} /> : 
            <div className="app">
              {this.state.isWebexConnected ? <Content webex={this.webex} /> : loading}
            </div>}
        </div>
      }
    </>

    return loading;
  }
}