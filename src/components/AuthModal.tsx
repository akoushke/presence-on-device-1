
import React, {useState, useRef, useEffect} from 'react';
import {Modal, ModalBody, ModalFooter, Button, Link} from '@momentum-ui/react';
import QRCode from 'qrcode.react';
import {login_url} from '../constants';


export default ({loginState}): JSX.Element => {
  const [showModal, setShowModal] = useState(true);
  console.log(`${login_url}&state=${loginState}`)
  const modal =   
    <Modal
      applicationId='app'
      backdrop={true}
      onHide={() => setShowModal(false)}
      show={showModal}
      size='medium'
      htmlId='modalDialog'
    >
      <ModalBody>
        <div className='loginContent'>
          <h2 className="loginHeader">Login With Your Phone</h2>
          <QRCode value={`${login_url}&state=${loginState}`} size={300}/>
        </div>
      </ModalBody>
      <ModalFooter> 
          <Link href={`${login_url}`}>Login with This Device</Link>
      </ModalFooter>
    </Modal>

  return <div>{modal}</div>;
}