import React, {useState} from 'react';
import {ToggleSwitch} from '@momentum-ui/react';
import Search from './Search';
import Fav from './Fav';

interface Props {
  webex: any
}
const Placeholder = () => <div className="placeholder" />;

const Content = ({webex}: Props): JSX.Element => {
  const [people, setPeople] = useState(JSON.parse(localStorage.getItem('people')) || []);
  const [displayFavs, setDisplayFavs] = useState(true);

  const addPerson = (person) => {
    const newPeople = [...people, person];
    localStorage.setItem('people', JSON.stringify(newPeople));
    setPeople(newPeople);
  };

  const removePerson = (person) => {
    const folks = people.filter((peep) => peep !== person);
    localStorage.setItem('people', JSON.stringify(folks));
    setPeople([...folks]);
  }

  const favs = people.map((person) => 
    <Fav key={person.id} person={person} webex={webex} removePerson={removePerson}/>
  );

  const manageFavs = <Search 
    webex={webex}
    addPerson={addPerson}
    removePerson={removePerson}
    people={people}
  />;

  return <div className="content">
    <div className="favs">
      <ToggleSwitch 
        checked={displayFavs}
        htmlId="toggle"
        onChange={() => {setDisplayFavs(!displayFavs)}}
        className="toggle"
      />
      <div className="menus">
        {displayFavs ? favs : manageFavs}  
      </div>
    </div>
  </div>;
};

export default Content;
