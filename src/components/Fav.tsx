import React, {useEffect, useState} from 'react';
import {Button, Icon} from '@momentum-ui/react';
import { useMediaQuery } from 'react-responsive';
import PresenceAvatar from './PresenceAvatar';
import axios from 'axios';


interface Props {
  webex: any,
  person: any,
  removePerson: (person: any) => void
}

const Fav = ({webex, person, removePerson}: Props) => {
  const [disableCall, setDisableCall] = useState(true);
  const callPerson = async () => {
    window.location.href = `sip:${person.emails[0]}`;
  };
  const updateStatus = (status) => {
    if(status === 'active') setDisableCall(false);
  };
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  return <div className="menu">
    <PresenceAvatar 
      webex={webex}
      person={person}
      allowSubscription={true}
      size={isMobile ? 72 : 84}
      updateStatus={updateStatus}
      />
      <div className="menuContent">
        <div className="info">
          <div className="displayName">{`${person.firstName} ${person.lastName}`}</div>
          <div className="titleJob">{person.emails[0]}</div>
        </div>
        <Button
          disabled={disableCall}
          color="green"
          className="callButton"
          onClick={()=>{callPerson()}}
          circle={isMobile}
          >
          {isMobile ? <Icon name='icon-audio-call_14' /> : <div className="buttonTitle">Call</div>}
        </Button>
      </div>
  </div>
};

export default Fav;
