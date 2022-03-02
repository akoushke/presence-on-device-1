import React, {useState} from 'react';
import SearchList from './SearchList';
import {InputSearch} from '@momentum-ui/react';
import {searchPeople} from '../Webex';
import MyAvatarMenu from './MyAvatarMenu';
import PresenceAvatar from './PresenceAvatar';

interface Props {
  webex: any,
  addPerson: (person: any) => void
  removePerson: (person: any) => void
  people: Array<any>
}

const SearchAvatars = ({webex, person, removePerson}) => {
  const handleClick = (event) => {
    event.preventDefault();
    removePerson(person);
  }

  return  <div 
    onClick={(event) => {handleClick(event)}}
    className="searchAvatar">
      <PresenceAvatar 
        webex={webex}
        person={person}
        size={84}
      />
      <div className="searchDisplayName">{`${person.firstName} ${person.lastName}`}</div>
    </div> 
}

const Search = ({webex, addPerson, removePerson, people}: Props): JSX.Element => { 
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleOnChange = (event) => {
    if(event.target.value === '') {
      setIsLoading(false);
      setResults([]);
    } else  {
      setIsLoading(true);

      searchPeople(webex, event.target.value).then(({items}) => {
        setResults(items.slice(0, 10));
        setIsLoading(false);
        
      });
    }
  } 

  const cleanList = (person: any) => {
    setResults([]);
    addPerson(person);
  };

  const searchAvatars = people.map((person) => {
    return  <SearchAvatars webex={webex} person={person} key={person.id} removePerson={removePerson} />
  }
  );

  return <div className="search">
    <div className="searchInput">
      <InputSearch 
        clear
        htmlId='loadingSearchInput'
        containerSize='medium-6'
        isLoading={isLoading}
        name='loadingSearchInput'
        onChange={async (event) => {await handleOnChange(event)}}
        />
      <SearchList 
        webex={webex} 
        people={results}
        selectPerson={cleanList} />
    </div>
    <div className="avatars">
      {searchAvatars}
    </div>
  </div>
};

export default Search;
