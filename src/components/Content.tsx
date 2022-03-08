import React, {useState, useRef} from 'react';
import {ToggleSwitch, Modal, ModalBody, ModalFooter, Button, Input, Alert, AlertContainer} from '@momentum-ui/react';
import Search from './Search';
import Fav from './Fav';

interface Props {
  webex: any
}
const Placeholder = () => <div className="placeholder" />;

const Content = ({webex}: Props): JSX.Element => {
  const [people, setPeople] = useState(JSON.parse(localStorage.getItem('people')) || []);
  const [displayFavs, setDisplayFavs] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [usernameErr, setUsernameErr] = useState({});
  const [passwordErr, setPasswordErr] = useState({});
  const modalRef = useRef(null);
  const toggleRef= useRef(null);

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


  const login = async () => {
    if(username === 'admin' && password === "admin") {
      setDisplayFavs(false)
      setShowModal(false);
    } else {
      if(username !== 'admin') setUsernameErr({message:'Wrong Username', type:'error'});
      if(password !== 'admin') setPasswordErr({message:'Wrong Password', type:'error'});

      setShowAlert(true);
      setTimeout(()=> {
        setShowAlert(false);
      }, 2000)
    }
  };

  const placeholders = <>
    <div className='menu' />
    <div className='menu' />
    <div className='menu' />
    <div className='menu' />
    <div className='menu' />
  </>;

  const modal =   
    <Modal
      applicationId='app'
      backdrop={true}
      onHide={() => setShowModal(false)}
      show={showModal}
      ref={modalRef}
      size='dialog'
      htmlId='modalDialog'
    >
      <ModalBody>
        <div className='loginContent'>
          <h1 className="loginHeader">Login</h1>
          <Input 
            label="Username"
            placeholder="admin" 
            onChange={(e) => {setUsernameErr({}); setUsername(e.target.value)}} 
            messageArr={[usernameErr]}/>
          <Input 
            label="Password"
            placeholder="admin" 
            onChange={(e) => {setPasswordErr({}); setPassword(e.target.value)}} 
            type="password"
            messageArr={[passwordErr]}/>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          children='Cancel'
          onClick={() => {
            setPasswordErr({});
            setUsernameErr({});
            setShowModal(false);
            toggleRef.current.setState({isToggleOn: true});
          }}
          ariaLabel='Close Modal'
          color='red'
        />
        <Button
          children='Login'
          onClick={() => login()}
          ariaLabel='Submit Form'
          color='green'
        />
      </ModalFooter>
    </Modal>;

  const errorAlert = 
    <AlertContainer>
      <Alert
        closable={false}
        title='Alert'
        message={'Incorrect Creds. Try again!'}
        show={showAlert}
        type='error'
      />
  </AlertContainer>;

  return <div className="content">
    {errorAlert}
    {modal}
    <div className="favs">
      <ToggleSwitch 
        checked={displayFavs}
        htmlId="toggle"
        onChange={() => displayFavs ? setShowModal(true) : setDisplayFavs(true)}
        ref={toggleRef}
        className="toggle"
      />
      <div className="menus">
        {displayFavs ? favs.length === 0 ? placeholders : favs : manageFavs}  
      </div>
    </div>
  </div>;
};

export default Content;
