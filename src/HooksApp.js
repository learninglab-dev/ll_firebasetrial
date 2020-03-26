import React, { useState, useEffect, useRef } from 'react'
import Firebase from 'firebase'
import config from './config'


export default function App(){
  const [developers, setDevelopers] = useState([])
  const [formValue, setFormValue] = useState({name: '', role: ''})
  const indexToUpdate = useRef(null)

  const getUserData = () => {
    let ref = Firebase.database().ref('/')
    ref.on('value', snapshot => {
      const dBState = snapshot.val()
      console.log(`db snap: ${dBState}`)
      if (dBState) {
        setDevelopers(dBState)
      }
    })
    console.log('DATA RETRIEVED')
  }

  useEffect(() => {
    Firebase.initializeApp(config)
    getUserData()
  }, [])
  useEffect(() => {
    console.log(developers)
    const writeUserData = () => {
      Firebase.database().ref('/').set(developers)
      console.log('DATA SAVED')
    }
    if (developers.length > 0) {
      writeUserData()
    }
  }, [developers])

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = formValue.name
    const role = formValue.role
    if (indexToUpdate.current !== null) {
      let update = [...developers]
      update[indexToUpdate.current].name = name
      update[indexToUpdate.current].role = role
      indexToUpdate.current = null
      setDevelopers(update)
      setFormValue({name: '', role: ''})
      return
    }
    const uid = new Date().getTime().toString()
    setDevelopers([...developers, { name: name, role: role, uid: uid }])
    setFormValue({name: '', role: ''})
  }
  const removeData = (developer) => {
    const newState = developers.filter(data => {
      return data.uid !== developer.uid
    });
    setDevelopers(newState)
  }
  const updateData = (developer, i) => {
    indexToUpdate.current = i
    setFormValue({name: developer.name, role: developer.role})
  }

  const cards = Array.isArray(developers) ? developers.map((developer, i) => {return (
    <div key={developer.uid} className="card float-left" style={{width: '18rem', marginRight: '1rem'}}>
      <div className="card-body">
        <h5 className="card-title">{ developer.name }</h5>
        <p className="card-text">{ developer.role }</p>
        <button onClick={() => removeData(developer)} className="btn btn-link">Delete</button>
        <button onClick={() => updateData(developer, i)} className="btn btn-link">Edit</button>
        </div>
      </div>)
    }) : <p>test</p>

  return (
    <div className="container">
      <div className="row">
        <div className='col-xl-12'>
          <h1>Firebase Development Team</h1>
        </div>
      </div>
    <div className='row'>
      <div className='col-xl-12'>
      {cards}
        </div>
      </div>
      <div className='row'>
        <div className='col-xl-12'>
          <h1>Add new team member here</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Name</label>
                <input type="text" onChange={(e) => setFormValue({...formValue, name: e.target.value})} className="form-control" value={formValue.name} />
              </div>
              <div className="form-group col-md-6">
                <label>Role</label>
                <input type="text" onChange={(e) => setFormValue({...formValue, role: e.target.value})} className="form-control" value={formValue.role} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}
