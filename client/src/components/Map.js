import React, { useState, useEffect, useContext } from 'react'
import './Map.css'
import { GoogleMap, Marker } from '@react-google-maps/api'
import PlacesAutocomplete from './PlacesAutocomplete'
import '@reach/combobox/styles.css'
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import api from '../api/url'
import { UserContext } from '../App'

const Map = (props) => {

  const [center, setCenter] = useState(props.location)
  const [selected, setSelected] = useState(null)
  const [address, setAddress] = useState('')  
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [review, setReview] = useState('')
  const { user } = useContext(UserContext);
  const [submitResponse, setSubmitResponse] = useState('')

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    api.post("/reviews", 
      { 
          email: user.email,
          sub: user.sub,
          address: address,
          title: title,
          complaint: review,
          latitude: selected.lat,
          longitude: selected.lng
      }
      ).then((api_res) => {
          console.log(api_res.status)
          console.log(api_res.statusText)
          if (api_res.statusText === "Created") {
            setSubmitResponse("Review created successfully!")
          }
          setTimeout(() => {
            setTitle('')
            setReview('')
            setSubmitResponse('')
            toggleDrawer()
          }
          , 3000)
      }).catch((err) => {
          console.log(err)
          setSubmitResponse("Error creating review")
      })
  }

  useEffect(() => {
    if(selected) {
      setCenter(selected)
      setTitle('')
      setReview('')
    }
  }, [selected])

  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} setAddress={setAddress}/>
        <div className="add-button" onClick={toggleDrawer}>Add Review</div>
      </div>
      <GoogleMap zoom={13} center={center} mapContainerClassName='map-container'>
        {selected && <Marker position={selected} />}
      </GoogleMap>
      <Drawer open={drawerOpen} onClose={toggleDrawer} anchor="bottom" className="add-drawer">
        <div className='drawer-body'>
          {
            address ? 
              <div className='drawer-upper'>
                <div className='drawer-title'>Add Review</div>
                <div>Confirm Address: {address}</div>
                <form className='drawer-form' onSubmit={handleSubmit}>
                    <TextField
                      id="title"
                      multiline
                      maxRows={4}
                      label="Title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      inputProps={{ maxLength: 512 }}
                    />
                    <TextField
                      id="review"
                      multiline
                      maxRows={6}
                      label="Review"
                      value={review}
                      onChange={e => setReview(e.target.value)}
                      inputProps={{ maxLength: 1024 }}
                    />
                    <div className="form-buttons">
                      <Button variant="contained" className="form-button" color="error" onClick={toggleDrawer}>Cancel</Button>
                      <Button variant="contained" className="form-button" type="submit">Submit</Button>
                    </div>
                    {
                      submitResponse && <div className='submit-response'>{submitResponse}</div>
                    }
                </form>
              </div>
            : 
            <div className='drawer-upper'>Please select a location</div>
          }
        </div>
      </Drawer>
    </>
  )
}

export default Map