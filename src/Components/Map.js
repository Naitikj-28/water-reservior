import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dam locations
const damLocations = {
  'Krishna Raja Sagara Dam': [12.4255, 76.5724],
  'Hemavathi Dam': [12.8138, 76.0218],
  'Kabini Dam': [11.9735, 76.3528],
  'Harangi Dam': [12.491667, 75.905556]
};

// Free Esri Satellite Tiles URL
const esriSatelliteURL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

function CenterMap({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, map]);

  return null;
}

function MapData({ selectedDam }) {
  const selectedDamCoords = damLocations[selectedDam];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={selectedDamCoords || [12.4255, 76.5724]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={esriSatelliteURL}
          attribution='Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        />
        {selectedDamCoords && (
          <>
            <Marker
              position={selectedDamCoords}
              icon={new L.Icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>{selectedDam}</Popup>
            </Marker>
            <CenterMap coords={selectedDamCoords} />
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default MapData;
