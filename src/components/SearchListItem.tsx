import React, {useEffect, useState} from 'react';
import PresenceAvatar from './PresenceAvatar';
import {List, ListItem, ListItemSection, Popover, InputSearch} from '@momentum-ui/react';

interface Props {
  webex: any,
  person: any,
}

export default ({webex, person}: Props) => { 
  return (
    <ListItem label={person.id} className="searchItem">
      <ListItemSection position="left" className="leftItem">
        <div>
          <PresenceAvatar webex={webex} person={person}/>
        </div>
      </ListItemSection>
      <ListItemSection position="center">
        <div>
          {person.displayName}
        </div>
      </ListItemSection>
      <ListItemSection position="left" />
    </ListItem>
  )
}