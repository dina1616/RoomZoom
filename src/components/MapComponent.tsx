'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  center: [number, number];
  zoom: number;
  markerPosition?: [number, number];
  onMarkerChange?: (lat: number, lng: number) => void;
  showControls?: boolean;
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

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom,
  markerPosition,
  onMarkerChange,
  showControls = true,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);

  // Fix for Leaflet icon issue in Next.js
  useEffect(() => {
    // Define the default icon URL and sizes
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Initialize the map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(center, zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
      
      mapRef.current = map;
      setMapReady(true);
      
      // Cleanup function to unmount map
      return () => {
        map.remove();
        mapRef.current = null;
      };
    }
  }, [center, zoom]);
  
  // Add marker if map is ready
  useEffect(() => {
    if (mapReady && mapRef.current) {
      // Initial position - either use provided marker position or center
      const position = markerPosition || center;
      
      // Remove existing marker if it exists
      if (markerRef.current) {
        markerRef.current.remove();
      }
      
      // Create new marker
      const marker = L.marker(position, { draggable: showControls }).addTo(mapRef.current);
      markerRef.current = marker;
      
      // Handle drag events if onMarkerChange callback is provided
      if (onMarkerChange) {
        marker.on('dragend', () => {
          const newPosition = marker.getLatLng();
          onMarkerChange(newPosition.lat, newPosition.lng);
        });
      }
      
      // Handle click events for positioning if showControls is true
      if (showControls) {
        mapRef.current.on('click', (e) => {
          const { lat, lng } = e.latlng;
          
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          }
          
          if (onMarkerChange) {
            onMarkerChange(lat, lng);
          }
        });
      }
    }
  }, [mapReady, center, markerPosition, onMarkerChange, showControls]);
  
  // Update view if center changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);
  
  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;
