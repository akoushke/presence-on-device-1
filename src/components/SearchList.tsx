import React from 'react';
import SearchListItem from './SearchListItem';
import {List} from '@momentum-ui/react';

interface Props {
  webex: any,
  people: Array<any>,
  selectPerson: (person: any) => void
}

const SearchList = ({webex, people, selectPerson}: Props): JSX.Element => { 
  const items = people.map((person) => {
    return <SearchListItem key={person.id} webex={webex} person={person} />
  });

  const handleOnSelect = (selected) => {
    const person = people.filter((person) => person.id === selected.label)[0];
    selectPerson(person);
  }

  return <List 
    onSelect={(_, selected) => {handleOnSelect(selected)}}
    className="searchList">
    {items}
  </List> ;
};

export default SearchList;
