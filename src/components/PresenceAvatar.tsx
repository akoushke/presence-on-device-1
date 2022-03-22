import React, {useEffect, useState} from 'react';
import {subscribePresence, getCurrentPresenceStatus, unsubscribePresence, getPerson} from '../Webex';
import {Avatar} from '@momentum-ui/react';

interface Props {
  webex: any,
  person: any,
  allowSubscription?: boolean
  size?: number | string,
  updateStatus?: (status: string) => void
}

export default ({webex, person, allowSubscription=false, size=28, updateStatus=()=>{}}: Props): JSX.Element => {
  const [type, setType] = useState('');

  useEffect(() => {
    const mode = localStorage.getItem('mode');
    
    if(mode === 'pubSub') {
      if(allowSubscription) {
        subscribePresence(webex, person.id, (status) => {
          if(!status || status === 'unknown') {
            status = '';
          }
          
          updateStatus(status)
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
    } else {
      const interval = localStorage.getItem('interval');
      
      //Initial Load
      getPerson(undefined, person.id).then(({status}) => setType(status));

      setInterval(async() => {
        const {status} = await getPerson(undefined, person.id);

        setType(status);
      }, Number(interval));
      
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
