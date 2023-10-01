import React, { useState, useMemo } from 'react'
import './Map.css'
import { GoogleMap, Marker } from '@react-google-maps/api'
import PlacesAutocomplete from './PlacesAutocomplete'
import '@reach/combobox/styles.css'

const Map = (props) => {

  const center = useMemo(() => ( props.location ), [props.location])
  const [selected, setSelected] = useState(null)

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