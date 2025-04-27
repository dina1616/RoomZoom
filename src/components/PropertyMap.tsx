'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Fix Leaflet's default icon
// These imports are no longer needed since we're using static paths
// import marker from 'leaflet/dist/images/marker-icon.png';
// import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the default icon paths for Leaflet - required for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper function to validate coordinates
const isValidCoordinate = (lat?: number, lng?: number): boolean => {
  return typeof lat === 'number' && 
         typeof lng === 'number' && 
         !isNaN(lat) && 
         !isNaN(lng) && 
         lat !== null && 
         lng !== null;
};

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  price: number;
  zoom?: number;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  latitude, 
  longitude, 
  title, 
  price, 
  zoom = 15 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  
  useEffect(() => {
    // Reset map view if lat, lng, or zoom changes
    if (mapRef.current) {
      mapRef.current.setView([latitude, longitude], zoom);
    }
  }, [latitude, longitude, zoom]);

  // Default to London center if coordinates are invalid
  const defaultCenter: [number, number] = [51.5074, -0.1278]; // London center
  const position: [number, number] = isValidCoordinate(latitude, longitude) 
    ? [latitude, longitude] 
    : defaultCenter;

  if (!isValidCoordinate(latitude, longitude)) {
    console.warn(`Invalid coordinates for property: ${title}, using default London center`);
  }

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {isValidCoordinate(latitude, longitude) && (
        <Marker position={position}>
          <Popup>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-blue-600 font-medium">£{price.toLocaleString()}/month</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default PropertyMap; 