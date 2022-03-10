import {deconstructHydraId} from '@webex/common';
import isemail from 'isemail';
import axios from 'axios';

export const subscribePresence = async (webex: any, hydraID: string, callback: (event: any)=>void): Promise<void> => {
  try {
    const {id} = deconstructHydraId(hydraID);
    const response = await webex.internal.presence.subscribe(id, 600);
    
    webex.internal.mercury.on('event:apheleia.subscription_update', (event) => {
      if(event.data.subject === id) {
        callback(event.data.status);
      }
    });
  
    callback(response.responses[0]?.status?.status);
  } catch(error) {
    console.log(`subscribe ${error}`);
  }
};

export const getCurrentPresenceStatus = async (webex, hydraID: string): Promise<any> => {
  try {
    const {id} = deconstructHydraId(hydraID);
    const response = await webex.internal.presence.list([id]);

    return response.statusList[0].status;
  } catch(error) {
    console.log(`getCurrentPresenceStatus ${error}`)
  }
}

export const unsubscribePresence = async (webex: any, hydraID: string) => {
  try {
    const {id} = deconstructHydraId(hydraID);
    await webex.internal.presence.unsubscribe(id);
    } catch (error) {
      console.log(`unsubscribe ${error}`);
    }
};

export const setPresence = async (status, ttl, webex): Promise<void> => {
  try {
    const time = parseInt(ttl, 10) * 60; // ttl in seconds
    await webex.internal.presence.setStatus(status, time);
  } catch (error) {
    console.log(`setPresence ${error}`)
  }
}

export const getPerson = async (webex, id): Promise<any> => {
  try {
    return await webex.people.get(id);
  } catch(error) {
    console.log(`getMe() ${error}`);
  }
}

export const enablePresence = async(webex) : Promise<boolean> => {
  try {
    return webex.internal.presence.enable();
  } catch(error) {
    console.log(`enablePresence() ${error}`);
  }
}

export const disablePresence = async(webex): Promise<boolean> => {
  try {
    return webex.internal.presence.disable();
  } catch (error) {
    console.log(`disablePresence() ${error}`);
  }
}

export const isPresenceEnabled = async(webex): Promise<boolean> => {
  try {
    return webex.internal.presence.isEnabled();
  } catch(error) {
    console.log(`isPresenceEnabled() ${error}`);
  }
}

export const getPeople = async(webex, ids): Promise<any> => {
  try {
    return await webex.people.get(ids);
  } catch (error) {
    console.log(`getPeople() ${error}`)
  }
}

export const searchPeople = async (webex, input): Promise<any> => {
  try {
    const options = {
      showAllTypes: false,
      max:10
    };

    if(isemail.validate(input)) {
      options.email = input;
    } else {
      options.displayName = input;
    }

    return await webex.people.list(options);
  } catch (error) {
    console.log(`listPeople ${error}`);
  }
}