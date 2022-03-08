import React, { useState, useEffect } from "react";
import {io} from 'socket.io-client';
import axios from 'axios';
import queryString from 'querystring';
import {Spinner} from '@momentum-ui/react';
import {client_id, client_secret, redirect_uri, auth_url, server_url} from '../constants';
import { storeToken } from "../utils";

export default () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let socket;
    const code = new URLSearchParams(window.location.search).get("code");
    const state = new URLSearchParams(window.location.search).get("state");

    if(code) {
      const loginPromise = axios.post(auth_url, queryString.stringify({
        code,
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

      if(state) {
       loginPromise.then(({data}) => {
          socket = io(server_url);

          data.state = state;
          socket.emit('token', data);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));    
      } else {
        loginPromise.then(({data}) => {
          storeToken(data);
          window.location = '/';
        })
      }
    } else {
      window.location = "/";
    }

    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <div>
      { isLoading ? 
        <Spinner /> :
        <div>
          <h4>Login Completed Successfully!</h4>
          <p>You may now close this tab!</p>
        </div>
      }
    </div>);
}