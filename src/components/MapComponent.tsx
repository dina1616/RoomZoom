'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom price marker icon creator
const createPriceIcon = (price: number) => {
  return L.divIcon({
    className: 'custom-price-marker',
    html: `<div class="bg-blue-600 text-white rounded-full px-2 py-1 font-semibold shadow-lg">£${price}</div>`,
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  });
};

// London universities data
const universities = [
  { name: "University College London", lat: 51.5246, lng: -0.1339 },
  { name: "King's College London", lat: 51.5115, lng: -0.1160 },
  { name: "London School of Economics", lat: 51.5144, lng: -0.1165 },
  { name: "Imperial College London", lat: 51.4988, lng: -0.1749 },
  { name: "Queen Mary University of London", lat: 51.5246, lng: -0.0384 },
  { name: "SOAS University of London", lat: 51.5223, lng: -0.1288 }
];

// Custom university icon
const universityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export interface Property {
  id: string;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  properties?: Property[];
}

// Helper function to validate coordinates
const isValidCoordinate = (lat?: number, lng?: number): boolean => {
  return typeof lat === 'number' && 
         typeof lng === 'number' && 
         !isNaN(lat) && 
         !isNaN(lng) && 
         lat !== null && 
         lng !== null;
};

// Component to automatically fetch properties and update map
function PropertiesLayer() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const map = useMap();

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        
        // Filter out properties with invalid coordinates
        const validProperties = data.filter((prop: Property) => 
          isValidCoordinate(prop.latitude, prop.longitude)
        );
        
        setProperties(validProperties);
        
        // If we have properties, fit the map to show them all
        if (validProperties.length > 0) {
          const bounds = validProperties.reduce((acc: L.LatLngBounds | null, prop: Property) => {
            if (!isValidCoordinate(prop.latitude, prop.longitude)) return acc;
            
            const point = new L.LatLng(prop.latitude, prop.longitude);
            if (!acc) return new L.LatLngBounds(point, point);
            return acc.extend(point);
          }, null);
          
          if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [map]);

  if (loading) return null;

  return (
    <>
      {properties.map((property) => (
        isValidCoordinate(property.latitude, property.longitude) && (
          <Marker 
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={createPriceIcon(property.price)}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold">{property.title}</h3>
                <p className="text-blue-600 font-semibold">£{property.price}/month</p>
                <a 
                  href={`/en/properties/${property.id}`} 
                  className="text-blue-500 hover:underline mt-1 block"
                >
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </>
  );
}

export default function MapComponent({ 
  center = [51.5074, -0.1278], // London center
  zoom = 12,
  properties = []
}: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 animate-pulse">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Display universities */}
        {universities.map((uni, index) => (
          isValidCoordinate(uni.lat, uni.lng) && (
            <Marker 
              key={`uni-${index}`} 
              position={[uni.lat, uni.lng]}
              icon={universityIcon}
            >
              <Popup>
                <b>{uni.name}</b>
              </Popup>
            </Marker>
          )
        ))}

        {/* Properties passed as props */}
        {properties.map((property) => (
          isValidCoordinate(property.latitude, property.longitude) && (
            <Marker 
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createPriceIcon(property.price)}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold">{property.title}</h3>
                  <p className="text-blue-600 font-semibold">£{property.price}/month</p>
                  <a 
                    href={`/en/properties/${property.id}`} 
                    className="text-blue-500 hover:underline mt-1 block"
                  >
                    View Details
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* Dynamically load properties */}
        <PropertiesLayer />
      </MapContainer>
    </div>
  );
}
