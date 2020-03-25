import React, { useState, useEffect, useRef } from 'react'
import Firebase from 'firebase'
import config from './config'


export default function App () {
  const [developers, setDevelopers] = useState([])
  const nameRef = useRef()
  const roleRef = useRef()
  const uidRef = useRef()

  const getUserData = () => {
    let ref = Firebase.database().ref('/');
    ref.on('value', snapshot => {
      const dbState = snapshot.val();
      setDevelopers(dbState);
    });
    console.log('DATA RETRIEVED');
  }

  useEffect(() => {
    Firebase.initializeApp(config)
    getUserData()
  }, [])
  useEffect(() => {
    const writeUserData = () => {
      Firebase.database().ref('/').set(developers);
      console.log('DATA SAVED')
    }
    writeUserData()
  }, [developers])
  const handleSubmit = (event) => {
    event.preventDefault()
    let name = nameRef.current.value
    let role = roleRef.current.value
    const uid = new Date().getTime().toString();
    setDevelopers([...developers, { uid, name, role }])

    nameRef.current.value = ''
    roleRef.current.value = ''
    uidRef.current.value = ''
  }
  return(
    <div className="container">
      <div className="row">
        <div className='col-xl-12'>
          <h1>Firebase Development Team</h1>
        </div>
      </div>
    <div className='row'>
      <div className='col-xl-12'>
      {(developers) &&
        developers
        .map(developer =>
          <div key={developer.uid} className="card float-left" style={{width: '18rem', marginRight: '1rem'}}>
            <div className="card-body">
              <h5 className="card-title">{ developer.name }</h5>
              <p className="card-text">{ developer.role }</p>
              <button onClick={ () => console.log("clicked delete")} className="btn btn-link">Delete</button>
              <button onClick={ () => console.log("clicked edit") } className="btn btn-link">Edit</button>
              </div>
            </div>
          )
        }
        </div>
      </div>
      <div className='row'>
        <div className='col-xl-12'>
          <h1>Add new team member here</h1>
          <form onSubmit={ (event) => handleSubmit(event) }>
            <div className="form-row">
              <input type='hidden' ref={uidRef.current} />
              <div className="form-group col-md-6">
                <label>Name</label>
                <input type="text" ref={nameRef.current} className="form-control" placeholder="Name" />
              </div>
              <div className="form-group col-md-6">
                <label>Role</label>
                <input type="text" ref={roleRef.current} className="form-control" placeholder="Role" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  )



}
