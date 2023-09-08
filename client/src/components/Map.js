import React from 'react'
import './Map.css'
import { GoogleMap, Marker } from '@react-google-maps/api'

const Map = () => {
  return (
    <div className="map">
        <GoogleMap zoom={10} center={{lat: 44, lng: -80}} mapContainerClassName='map-container'>
            <Marker position={{lat: 43.472973, lng: -80.540298}} />
        </GoogleMap>
    </div>
  )
}

export default Map