import React, {useEffect, useState} from 'react';
import {Button, EditableTextfield, Menu, MenuContent, MenuItem, MenuOverlay, Icon} from '@momentum-ui/react';
import PresenceAvatar from './PresenceAvatar';
import axios from 'axios';
import {getPerson} from '../Webex';

interface Props {
  webex: any,
  person: any,
  removePerson: (person: any) => void
}

const Fav = ({webex, person, removePerson}: Props) => {
  const [sipAddress, setSipAddress] = useState('No Available SIP Address');

  useEffect(() => {
    getPerson(person.id).then(({sipAddresses}) => {
      const sip = sipAddresses.filter((item) => (item.type === 'cloud-calling' && item.primary === true))[0];

      setSipAddress(sip.value);
    })
  },[])

  const onClick = async (event, value) => {
    const {label} = value;

    if(label === 'Sip Address') {
      await callPerson(sipAddress);
    } else {
      await callPerson(person.emails[0]);
    } 
  };

  const callPerson = async (destination) => {
    try {
    const data = JSON.stringify({
      "deviceId": "Y2lzY29zcGFyazovL3VybjpURUFNOnVzLXdlc3QtMl9yL0RFVklDRS8yNDg0Y2M2NS1kZjZjLTQ2NGMtOTEzNC0zNGY5ZDAxZTQ4MTA=",
      "arguments": {
        "Number": destination
      }
    });
    
    let config = {
      method: 'post',
      url: 'https://webexapis.com/v1/xapi/command/Webex.Join',
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('webex_token')}`, 
        Accept: 'application/json', 
        'Content-Type': 'application/json'
      },
      data : data
    };

    const response = await axios(config);
    } catch(e) {
      console.log(e);
    }
  };

  const menuItems = <>
    {sipAddress !== 'No Available SIP Address' && <MenuItem onClick={onClick} label="Sip Address" />}
    <MenuItem onClick={onClick} label="Email Address" />
  </>;

  return <div className="menu">
    <PresenceAvatar 
      webex={webex}
      person={person}
      allowSubscription={true}
      size={84}
      />
      <div className="menuContent">
        <div className="info">
          <div className="displayName">{`${person.firstName} ${person.lastName}`}</div>
          <div className="titleJob">{sipAddress}</div>
        </div>
       <MenuOverlay
        showArrow={false}
        menuTrigger={
          <Button 
            color="green"
            className="callButton"
          >
            <div className="buttonTitle">Call</div>
            <Icon name='arrow-down_20' />
          </Button>
        }
      >
        <Menu>
          {menuItems}
        </Menu>
      </MenuOverlay>
      </div>
  </div>
};

export default Fav;
