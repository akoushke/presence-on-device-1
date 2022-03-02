import React, {Component} from 'react';
import Webex from 'webex';
import moment from 'moment';
import {Button, Icon, Spinner, Avatar} from '@momentum-ui/react';
import Content from './Content';

declare type Props = null;

export default class App extends Component {
  state: any;
  webex: any;
  props: any;
  token: string;

  constructor(props: Props) {
    super(props);

    this.token = "";
    this.state = {
      webexIsConnected: false,
    };
    this.webex = new Webex({
      config: {
        credentials: {
          client_id: 'C3671a5d5848d3eec5772caa324303db9f1d43fa775160aa716637a8c32f7b248',
          client_secret: '3d330c2ff704cc773f4b4d14da39d433b4fc09bf06ddf6fd3bb34a7ec57b3528',
          // redirect_uri: 'https://wxsd-sales.github.io/WebexPresence',
          redirect_uri: 'https://webexpresence.ngrok.io',
          scope: 'spark:all spark:xapi_statuses spark:xapi_commands spark-admin:devices_read spark-admin:devices_write spark:devices_read spark:devices_write spark-admin:people_read spark-admin:people_write spark-admin:organizations_read spark-admin:organizations_write spark-admin:resource_group_memberships_read spark-admin:resource_group_memberships_write spark-admin:resource_groups_read spark-admin:roles_read spark-admin:workspaces_read'
        }
      }
    }); 
  }

  async componentDidMount(): Promise<void> {
    this.webex.on('ready', async() => {
      await this.validateToken();
    })
  }

  async validateToken(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('access_token');

    if(localStorage.getItem('webex_token')) {
      if((moment(localStorage.getItem('expiration_date')).diff(moment.utc()) < 0)) {
        localStorage.removeItem('webex_token');
        localStorage.removeItem('expiration_date');
        this.webex.authorization.initiateImplicitGrant();
      } else {
        const token = localStorage.getItem('webex_token').replace('Bearer ', '');

        await this.connect(token);
      }
    } else if (this.webex.credentials.supertoken) {
      const {access_token, expires_in} = this.webex.credentials.supertoken;
      const startDate = moment.utc();
      const expirationDate = startDate.add(Number(expires_in), 'seconds');

      localStorage.setItem('webex_token', access_token);
      localStorage.setItem('expiration_date', expirationDate.format());

      await this.connect(access_token);
    } else {
      this.webex.authorization.initiateImplicitGrant();
    }
  }

  async connect(token: string): Promise<void> {
    try {
      this.webex = new Webex({
        credentials: token
      });
      await this.webex.internal.device.register();
      await this.webex.internal.mercury.connect();

      this.setState({webexIsConnected: true});
    } catch (error) {
      console.log(error);
    }
  }


  render(): JSX.Element {
    return <div>
      {this.state.webexIsConnected ? 
        <div className="app">
          <Content webex={this.webex}/>
        </div> : 
        <Spinner />}
    </div>
  }
}