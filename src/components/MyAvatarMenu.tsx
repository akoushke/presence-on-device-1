import React, {useEffect, useState} from 'react';
import {Menu, MenuItem, MenuContent, SubMenu} from '@momentum-ui/react';
import PresenceAvatar from './PresenceAvatar';
import {getPerson, setPresence, enablePresence, disablePresence ,isPresenceEnabled} from '../Webex';

interface Props {
  webex: any
}

const MyAvatarMenu = ({webex}: Props) => {
  const one = {
    "id": "Y2lzY29zcGFyazovL3VzL1BFT1BMRS80N2MzMmQwYi0wNDQ0LTQ2MGQtOGJjZS0yMjY1YjUwMWFhYzU",
    "emails": [
        "akoushke@cisco.com"
    ],
    "phoneNumbers": [
        {
            "type": "mobile",
            "value": "+1 408-527-6715"
        },
        {
            "type": "work",
            "value": "+1 408-894-5448"
        }
    ],
    "displayName": "Arash Koushkebaghi",
    "nickName": "Arash",
    "firstName": "Arash",
    "lastName": "Koushkebaghi",
    "avatar": "https://avatar-prod-us-east-2.webexcontent.com/Avtr~V1~1eb65fdf-9643-417f-9974-ad72cae0e10f/V1~47c32d0b-0444-460d-8bce-2265b501aac5~311b7801865d484fb072dd0d5e8374bd~1600",
    "orgId": "Y2lzY29zcGFyazovL3VzL09SR0FOSVpBVElPTi8xZWI2NWZkZi05NjQzLTQxN2YtOTk3NC1hZDcyY2FlMGUxMGY",
    "created": "2016-12-04T15:55:38.969Z",
    "lastModified": "2021-08-17T18:29:16.008Z",
    "lastActivity": "2021-08-24T04:09:17.929Z",
    "status": "active",
    "type": "person",
    "xmppFederationJid": "akoushke@cisco.com"
  };
  const [me, setMe] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const durationOptions = [
    <MenuItem 
          key="30"
          title="30 Minutes"
          label="30 Minutes"
          onClick={async() => {await setPresence('dnd', 30, webex)}}
        />,
    <MenuItem 
      key="60"
      title="1 hour"
      label="1 hour"
      onClick={async() => {await setPresence('dnd', 60, webex)}}
    />,
    <MenuItem 
      key="120"
      title="2 hours"
      label="2 hours"
      onClick={async() => {await setPresence('dnd', 120, webex)}}
    />,
    <MenuItem 
      key="240"
      title="4 hours"
      label="4 hours"
      onClick={async() => {await setPresence('dnd', 240, webex)}}
    />,
    <MenuItem 
      key="480"
      title="8 hours"
      label="8 hours"
      onClick={async() => {await setPresence('dnd', 480, webex)}}
    />,
    <MenuItem 
      key="1440"
      title="24 hours"
      label="24 hours"
      onClick={async() => {await setPresence('dnd', 1440, webex)}}
    />,
    <MenuItem 
      key="Clear"
      title="Clear"
      label="Clear"
    />
  ];

  useEffect(() => {
    isPresenceEnabled(webex).then((response) => {
      setIsEnabled(response);
    });
  }, []);

  const logout = async() => {
    try {
      await webex.logout();
      localStorage.removeItem('webex_token');
      localStorage.removeItem('expiration_date');
    } catch(error) {
      console.log(`logout ${error}`);
    }
  };

  const disable = async () => {
    await disablePresence(webex);
    setIsEnabled(false);
  };

  const enable = async () => {
    await enablePresence(webex);
    setIsEnabled(true);
  };

  return  me && <div className="menuContentWrapper">
    <MenuContent className="menuContent">
      <PresenceAvatar 
        webex={webex}
        person={me}
        allowSubscription={true}
        size={84}
        />
      <div className="info">
        <div>{me.displayName}</div>
        <div className="email">{me.emails[0]}</div>
      </div>
    </MenuContent>
    <Menu 
      focusFirst={false}
      className="menu">
      <SubMenu
        label="Do not Disturb"
        title="Do Not Disturb"
        className="menuItem"
      >
        {durationOptions}
      </SubMenu>
      <MenuItem 
        className="menuItem"
        key="Active"
        title="Active"
        label="Active"
        onClick={async() => {await setPresence('dnd', 0, webex)}}
      />
      { isEnabled ? <MenuItem 
        className="menuItem"
        key="Disable Presence"
        title="Disable Presence"
        label="Disable Presence"
        onClick={async() => {await disable()}}
      /> :
      <MenuItem 
        className="menuItem"
        key="Enable Presence"
        title="Enable Presence"
        label="Enable Presence"
        onClick={async() => {await enable()}}
      /> }
      <MenuItem 
        className="emailMenuItem"
        title="Sign Out"
        label="Sign Out"
        onClick={async() => {await logout();}}
      />
    </Menu>
  </div>
}

export default MyAvatarMenu;