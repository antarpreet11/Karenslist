import React, { useState, useMemo, useEffect } from 'react'
import './Map.css'
import { GoogleMap, Marker } from '@react-google-maps/api'
import PlacesAutocomplete from './PlacesAutocomplete'
import '@reach/combobox/styles.css'

const Map = (props) => {

  const [center, setCenter] = useState(props.location)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if(selected) {
      setCenter(selected)
    }
  }, [selected])

  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected}/>
      </div>
      <GoogleMap zoom={13} center={center} mapContainerClassName='map-container'>
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  )
}

export default Map