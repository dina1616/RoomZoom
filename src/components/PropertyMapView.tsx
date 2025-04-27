'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icon issue (same as MapPane)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
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

interface PropertyMapViewProps {
    latitude: number;
    longitude: number;
    title: string;
}

const PropertyMapView: React.FC<PropertyMapViewProps> = ({ latitude, longitude, title }) => {
    // Default to London center if coordinates are invalid
    const defaultCenter: [number, number] = [51.5074, -0.1278]; // London center
    const position: [number, number] = isValidCoordinate(latitude, longitude) 
      ? [latitude, longitude] 
      : defaultCenter;
    const zoom = 15; // Zoom in closer for single property

    if (!isValidCoordinate(latitude, longitude)) {
        return <div className="h-[250px] bg-gray-200 flex items-center justify-center text-gray-500 rounded">Map location not available</div>;
    }

    return (
        <div className="h-[250px] md:h-[300px] w-full rounded overflow-hidden border">
             <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>{title}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default PropertyMapView; 