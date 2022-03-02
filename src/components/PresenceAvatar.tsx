import React, {useEffect, useState} from 'react';
import {subscribePresence, getCurrentPresenceStatus, unsubscribePresence} from '../Webex';
import {Avatar} from '@momentum-ui/react';

interface Props {
  webex: any,
  person: any,
  allowSubscription?: boolean
  size?: number
}

export default ({webex, person, allowSubscription=false, size=28}: Props): JSX.Element => {
  const [type, setType] = useState('');

  useEffect(() => {
    if(allowSubscription) {
      subscribePresence(webex, person.id, (status) => {
        if(!status || status === 'unknown') {
          status = '';
        }
  
        setType(status);
      });
    } else {
      getCurrentPresenceStatus(webex, person.id).then((status) => {
        if(!status || status === 'unknown') { 
          status = '';
        } 

        setType(status);
      });
    }
  
    return  () => {
      unsubscribePresence(webex, person.id).then();
    }
  }, [])

  return <Avatar 
            type={type} 
            src={person.avatar} 
            title={`${person.firstName} ${person.lastName}`} 
            size={size} />;
}
