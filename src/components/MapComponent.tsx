'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/lib/utils';
import { PropertyWithDetails as Property } from '@/types/property';
import Image from 'next/image';

// Fix Leaflet's default icon
// This needs to be done before any Leaflet Marker is created
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

// Create a styled price marker that scales with price
const createPriceIcon = (price: number) => {
  // Scale icon size based on price
  const baseSize = 60;
  const maxSize = 90;
  const scaleFactor = Math.min(price / 3000, 1); // Cap at 3000
  const size = baseSize + (maxSize - baseSize) * scaleFactor;
  
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="relative group">
        <div class="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-50 group-hover:opacity-70 transition-opacity"></div>
        <div class="relative bg-blue-600 text-white rounded-full px-2 py-1 font-semibold shadow-lg border border-blue-400 transform transition-transform group-hover:scale-110 flex items-center justify-center">
          £${price}
        </div>
      </div>
    `,
    iconSize: [size, size / 2],
    iconAnchor: [size / 2, size / 4],
  });
};

// London universities data with enhanced formatting
const universities = [
  { id: 'ucl', name: "University College London", lat: 51.5246, lng: -0.1339, color: "#E31937" },
  { id: 'kcl', name: "King's College London", lat: 51.5115, lng: -0.1160, color: "#AA0000" },
  { id: 'lse', name: "London School of Economics", lat: 51.5144, lng: -0.1165, color: "#A7A8AA" },
  { id: 'imperial', name: "Imperial College London", lat: 51.4988, lng: -0.1749, color: "#003E74" },
  { id: 'qmul', name: "Queen Mary University of London", lat: 51.5246, lng: -0.0384, color: "#5C068C" },
  { id: 'soas', name: "SOAS University of London", lat: 51.5223, lng: -0.1288, color: "#5A2D81" }
];

// Key London tube stations near student housing areas
const tubeStations = [
  { id: 'kings-cross', name: "King's Cross St. Pancras", lat: 51.5308, lng: -0.1238, line: "multiple" },
  { id: 'oxford-circus', name: "Oxford Circus", lat: 51.5152, lng: -0.1418, line: "multiple" },
  { id: 'camden', name: "Camden Town", lat: 51.5393, lng: -0.1427, line: "northern" },
  { id: 'brixton', name: "Brixton", lat: 51.4627, lng: -0.1145, line: "victoria" },
  { id: 'shoreditch', name: "Shoreditch High Street", lat: 51.5233, lng: -0.0755, line: "overground" },
  { id: 'stratford', name: "Stratford", lat: 51.5416, lng: -0.0038, line: "multiple" },
  { id: 'hammersmith', name: "Hammersmith", lat: 51.4925, lng: -0.2224, line: "multiple" },
  { id: 'mile-end', name: "Mile End", lat: 51.5249, lng: -0.0332, line: "multiple" }
];

// Major London landmarks as points of interest
const landmarks = [
  { id: 'big-ben', name: "Big Ben", lat: 51.5007, lng: -0.1246, type: "landmark" },
  { id: 'london-eye', name: "London Eye", lat: 51.5033, lng: -0.1195, type: "attraction" },
  { id: 'british-museum', name: "British Museum", lat: 51.5194, lng: -0.1269, type: "museum" },
  { id: 'tate-modern', name: "Tate Modern", lat: 51.5076, lng: -0.0994, type: "museum" },
  { id: 'natural-history', name: "Natural History Museum", lat: 51.4967, lng: -0.1764, type: "museum" },
  { id: 'o2-arena', name: "O2 Arena", lat: 51.5033, lng: 0.0030, type: "entertainment" },
  { id: 'westfield-stratford', name: "Westfield Stratford City", lat: 51.5432, lng: -0.0090, type: "shopping" },
  { id: 'westfield-white-city', name: "Westfield White City", lat: 51.5073, lng: -0.2241, type: "shopping" }
];

// London parks and green spaces
const parks = [
  { id: 'hyde-park', name: "Hyde Park", lat: 51.5073, lng: -0.1657, size: "large" },
  { id: 'regents-park', name: "Regent's Park", lat: 51.5307, lng: -0.1557, size: "large" },
  { id: 'victoria-park', name: "Victoria Park", lat: 51.5362, lng: -0.0359, size: "large" },
  { id: 'hampstead-heath', name: "Hampstead Heath", lat: 51.5608, lng: -0.1426, size: "large" },
  { id: 'clapham-common', name: "Clapham Common", lat: 51.4613, lng: -0.1500, size: "medium" },
  { id: 'greenwich-park', name: "Greenwich Park", lat: 51.4769, lng: 0.0005, size: "medium" }
];

// Function to create custom tube station icon
const createTubeStationIcon = () => {
  return L.divIcon({
    className: 'custom-tube-marker',
    html: `
      <div class="relative group">
        <div class="absolute inset-0 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity bg-red-600"></div>
        <div class="relative rounded-full h-4 w-4 border-2 border-white bg-red-600 transform transition-transform group-hover:scale-125">
          <div class="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

// Function to create landmark icon
const createLandmarkIcon = (type: string) => {
  let color;
  let icon;
  
  switch(type) {
    case 'museum':
      color = '#9c27b0'; // Purple
      icon = '<path d="M19 6h-9V5h9M5 8v10h10V8M12 3L4 8v1h16V8"/>';
      break;
    case 'shopping':
      color = '#ff9800'; // Orange
      icon = '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>';
      break;
    case 'attraction':
      color = '#e91e63'; // Pink
      icon = '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>';
      break;
    case 'entertainment':
      color = '#2196f3'; // Blue
      icon = '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>';
      break;
    default: // landmarks
      color = '#4caf50'; // Green
      icon = '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13c0-5 4-9 9-9s9 4 9 9z M12 11a2 2 0 100-4 2 2 0 000 4z"/>';
  }
  
  return L.divIcon({
    className: 'custom-landmark-marker',
    html: `
      <div class="relative group">
        <div class="absolute inset-0 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity" style="background-color: ${color}"></div>
        <div class="relative rounded-full h-5 w-5 border border-white transform transition-transform group-hover:scale-125" style="background-color: ${color}">
          <div class="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              ${icon}
            </svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
};

// Function to create park icon
const createParkIcon = (size: string) => {
  // Different sizes for different park sizes
  const iconSize = size === 'large' ? 26 : 20;
  
  return L.divIcon({
    className: 'custom-park-marker',
    html: `
      <div class="relative group">
        <div class="absolute inset-0 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity bg-green-700"></div>
        <div class="relative rounded-full h-${size === 'large' ? 6 : 4} w-${size === 'large' ? 6 : 4} border border-white bg-green-600 transform transition-transform group-hover:scale-125 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="text-white w-3 h-3">
            <circle cx="10" cy="10" r="5" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize/2, iconSize/2],
    popupAnchor: [0, -iconSize/2],
  });
};

// Function to create a custom university icon with university color
const createUniversityIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-university-marker',
    html: `
      <div class="relative group">
        <div class="absolute inset-0 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity" style="background-color: ${color}"></div>
        <div class="relative rounded-full h-5 w-5 border-2 border-white transform transition-transform group-hover:scale-125" style="background-color: ${color}">
          <div class="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Function to create a custom property icon
const createPropertyIcon = (isSelected: boolean, price?: number) => {
  // Create a more attractive property icon with price indication
  return L.divIcon({
    className: 'custom-property-marker',
    html: `
      <div class="relative group">
        <div class="absolute inset-0 rounded-full blur-sm opacity-60 group-hover:opacity-90 transition-opacity ${isSelected ? 'bg-blue-700' : 'bg-blue-500'}"></div>
        <div class="relative rounded-full h-6 w-6 border-2 border-white transform transition-transform group-hover:scale-125 ${isSelected ? 'bg-blue-700 scale-125' : 'bg-blue-500'} flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        ${price ? `
        <div class="absolute -top-6 -right-16 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded shadow-md border border-blue-400 whitespace-nowrap">
          £${price.toLocaleString()}
        </div>
        ` : ''}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Component to handle map recenter when property is selected
const SetViewOnSelect = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  const prevCoordsRef = useRef<[number, number] | null>(null);
  
  useEffect(() => {
    if (!coords) return;
    
    // Check if coordinates actually changed significantly (at least 0.0001 difference)
    const hasChanged = !prevCoordsRef.current || 
      Math.abs(coords[0] - prevCoordsRef.current[0]) > 0.0001 ||
      Math.abs(coords[1] - prevCoordsRef.current[1]) > 0.0001;
    
    if (hasChanged) {
      // Update the stored coordinates
      prevCoordsRef.current = coords;
      
      // Set the map view with animation
      map.setView(coords, 14, {
        animate: true,
      });
    }
  }, [coords, map]);
  
  return null;
};

// MapEvents component to handle map clicks
interface MapEventsProps {
  onMapClick: (e: L.LeafletMouseEvent) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

// Define the interface for the component props
interface MapComponentProps {
  properties?: Property[];
  selectedProperty?: Property;
  onPropertySelect?: (property: Property) => void;
  height?: string;
  width?: string;
  zoom?: number;
  center?: [number, number];
  showUniversities?: boolean;
  showTubeStations?: boolean;
  showLandmarks?: boolean;
  showParks?: boolean;
  showNeighborhoods?: boolean;
  showShoppingAreas?: boolean;
  transportNodes?: Array<{
    id: string;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    lines?: string;
  }>;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    amenities?: string[];
  };
  // Additional props for marker placement in property form
  markerPosition?: [number, number];
  onMarkerChange?: (lat: number, lng: number) => void;
  showControls?: boolean;
  disableAutoFetch?: boolean;
}

// Cache key for storing map properties
const MAP_CACHE_KEY = 'mapPropertiesCache';
// Cache timeout in milliseconds (5 minutes)
const MAP_CACHE_TIMEOUT = 5 * 60 * 1000;

// Additional London neighborhoods and student areas
const londonNeighborhoods = [
  { id: 'camden', name: "Camden", lat: 51.5390, lng: -0.1425, type: "student-area", description: "Vibrant market area popular with students" },
  { id: 'shoreditch', name: "Shoreditch", lat: 51.5229, lng: -0.0777, type: "student-area", description: "Trendy area with tech startups and nightlife" },
  { id: 'islington', name: "Islington", lat: 51.5362, lng: -0.1033, type: "residential", description: "Popular residential area with good connections" },
  { id: 'brixton', name: "Brixton", lat: 51.4626, lng: -0.1159, type: "student-area", description: "Diverse cultural area with music venues" },
  { id: 'hackney', name: "Hackney", lat: 51.5454, lng: -0.0558, type: "student-area", description: "Creative hub with affordable housing" },
  { id: 'clapham', name: "Clapham", lat: 51.4627, lng: -0.1680, type: "student-area", description: "Popular with young professionals" },
  { id: 'stratford', name: "Stratford", lat: 51.5431, lng: -0.0060, type: "student-area", description: "Home to Olympic Park and Westfield" },
  { id: 'bloomsbury', name: "Bloomsbury", lat: 51.5209, lng: -0.1277, type: "academic", description: "Academic center with major universities" },
  { id: 'south-kensington', name: "South Kensington", lat: 51.4949, lng: -0.1774, type: "academic", description: "Museum district and Imperial College" },
  { id: 'whitechapel', name: "Whitechapel", lat: 51.5180, lng: -0.0627, type: "student-area", description: "Affordable area with rich history" },
  { id: 'bethnal-green', name: "Bethnal Green", lat: 51.5271, lng: -0.0549, type: "student-area", description: "Trendy area with Victoria Park nearby" },
  { id: 'finsbury-park', name: "Finsbury Park", lat: 51.5642, lng: -0.1066, type: "residential", description: "Green spaces and good transport links" },
  { id: 'wembley', name: "Wembley", lat: 51.5560, lng: -0.2795, type: "entertainment", description: "Home to Wembley Stadium and arena" },
  { id: 'hammersmith', name: "Hammersmith", lat: 51.4927, lng: -0.2248, type: "residential", description: "Riverside area with good amenities" },
  { id: 'euston', name: "Euston", lat: 51.5282, lng: -0.1337, type: "transport-hub", description: "Major railway station and UCL nearby" },
  { id: 'hoxton', name: "Hoxton", lat: 51.5320, lng: -0.0800, type: "student-area", description: "Artistic area with galleries and bars" },
  { id: 'balham', name: "Balham", lat: 51.4431, lng: -0.1519, type: "residential", description: "Suburban feel with good nightlife" },
  { id: 'notting-hill', name: "Notting Hill", lat: 51.5139, lng: -0.1969, type: "residential", description: "Trendy area famous for Portobello Market" },
  { id: 'greenwich', name: "Greenwich", lat: 51.4763, lng: -0.0005, type: "student-area", description: "Historic area with university campus" },
  { id: 'dalston', name: "Dalston", lat: 51.5461, lng: -0.0754, type: "student-area", description: "Diverse area with nightlife and restaurants" }
];

// Additional shopping streets and centers
const shoppingAreas = [
  { id: 'oxford-street', name: "Oxford Street", lat: 51.5152, lng: -0.1418, type: "shopping-street" },
  { id: 'covent-garden', name: "Covent Garden", lat: 51.5117, lng: -0.1240, type: "shopping-market" },
  { id: 'carnaby-street', name: "Carnaby Street", lat: 51.5134, lng: -0.1395, type: "shopping-street" },
  { id: 'spitalfields', name: "Spitalfields Market", lat: 51.5190, lng: -0.0736, type: "shopping-market" },
  { id: 'borough-market', name: "Borough Market", lat: 51.5055, lng: -0.0892, type: "food-market" },
  { id: 'camden-market', name: "Camden Market", lat: 51.5417, lng: -0.1463, type: "shopping-market" },
  { id: 'boxpark-shoreditch', name: "Boxpark Shoreditch", lat: 51.5235, lng: -0.0772, type: "shopping-center" },
  { id: 'westfield-london', name: "Westfield London", lat: 51.5065, lng: -0.2219, type: "shopping-center" }
];

// Function to create neighborhood icon
const createNeighborhoodIcon = (type: string) => {
  // Different colors for different neighborhood types
  let color;
  switch(type) {
    case 'student-area':
      color = '#4f46e5'; // Indigo
      break;
    case 'academic':
      color = '#0ea5e9'; // Sky blue
      break;
    case 'residential':
      color = '#10b981'; // Emerald
      break;
    case 'entertainment':
      color = '#f59e0b'; // Amber
      break;
    case 'transport-hub':
      color = '#ef4444'; // Red
      break;
    default:
      color = '#6b7280'; // Gray
  }
  
  return L.divIcon({
    className: 'custom-neighborhood-marker',
    html: `
      <div class="relative group">
        <div class="absolute inset-0 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity" style="background-color: ${color}"></div>
        <div class="relative rounded-full h-4 w-4 border border-white transform transition-transform group-hover:scale-125" style="background-color: ${color}">
          <div class="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
  });
};

// Function to create shopping area icon
const createShoppingIcon = (type: string) => {
  let color = '#ec4899'; // Pink default
  let icon;
  
  switch(type) {
    case 'shopping-street':
      color = '#ec4899'; // Pink
      icon = '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />';
      break;
    case 'shopping-market':
      color = '#a855f7'; // Purple
      icon = '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />';
      break;
    case 'shopping-center':
      color = '#d946ef'; // Fuchsia
      icon = '<path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />';
      break;
    case 'food-market':
      color = '#f97316'; // Orange
      icon = '<path d="M21 15.999V18h-9v-2.001h9zm0-3V15h-9v-2.001h9zm0-3V12h-9V9.999h9zm-10 0v10h-1V6.997h11v3.002H11zm-1-5c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v1H10v-1zM8 2c-.55 0-1 .45-1 1v1H5v10c0 1.1.9 2 2 2h1v3c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-3h1c.3 0 .58-.09.84-.2L7.4 3.8C7.17 2.75 6.66 2 6 2H4c-.55 0-1 .45-1 1s.45 1 1 1h.5L8 2z" />';
      break;
    default:
      icon = '<path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />';
  }
  
  return L.divIcon({
    className: 'custom-shopping-marker',
    html: `
      <div class="relative group">
        <div class="absolute inset-0 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity" style="background-color: ${color}"></div>
        <div class="relative rounded-full h-4 w-4 border border-white transform transition-transform group-hover:scale-125" style="background-color: ${color}">
          <div class="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2 text-white" viewBox="0 0 24 24" fill="currentColor">
              ${icon}
            </svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
  });
};

// Main Map Component
const MapComponent: React.FC<MapComponentProps> = ({
  properties: propProperties = [], // Default to empty array for props-provided properties
  selectedProperty,
  onPropertySelect,
  height = '600px',
  width = '100%',
  zoom = 12,
  center = [51.5074, -0.1278], // Default to central London
  showUniversities = true,
  showTubeStations = true,
  showLandmarks = true,
  showParks = true,
  showNeighborhoods = true,
  showShoppingAreas = true,
  transportNodes = [],
  filters = {},
  markerPosition,
  onMarkerChange,
  showControls = true,
  disableAutoFetch = false,
}) => {
  const t = useTranslations('Map');
  const mapRef = useRef(null);
  const params = useParams();
  
  // Track if this is the initial render
  const isFirstRender = useRef(true);
  // Track if fetch has been attempted
  const fetchAttemptedRef = useRef(false);
  
  // Memoized properties state - defaults to propProperties
  const [properties, setProperties] = useState<Property[]>(propProperties);
  const [loading, setLoading] = useState(false);
  
  // Store previous filter values to detect changes
  const prevFiltersRef = useRef<string>('');
  
  // Function to check cache and load cached data
  const checkAndLoadCache = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const cacheKey = `${MAP_CACHE_KEY}-${JSON.stringify(filters)}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          // Check if cache is still valid (not expired)
          if (Date.now() - timestamp < MAP_CACHE_TIMEOUT && Array.isArray(data) && data.length > 0) {
            setProperties(data);
            setLoading(false);
            return true; // Cache was valid and loaded
          } else {
            // Clear expired cache
            sessionStorage.removeItem(cacheKey);
          }
        }
      }
    } catch (err) {
      console.error('Cache read error:', err);
    }
    return false; // No valid cache found
  }, [filters]);
  
  // Function to update cache
  const updateCache = useCallback((data: Property[]) => {
    try {
      if (typeof window !== 'undefined') {
        const cacheKey = `${MAP_CACHE_KEY}-${JSON.stringify(filters)}`;
        const cacheData = {
          data,
          timestamp: Date.now()
        };
        sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
      }
    } catch (err) {
      console.error('Cache write error:', err);
    }
  }, [filters]);
  
  // Memoize the fetch function with useCallback
  const fetchFilteredProperties = useCallback(async () => {
    // Avoid duplicate fetches within the same session/render
    if (fetchAttemptedRef.current) {
      return;
    }
    
    // Try to load from cache first
    if (checkAndLoadCache()) {
      return; // Successfully loaded from cache
    }
    
    console.log('MapComponent: Fetching properties with filters:', filters);
    
    setLoading(true);
    fetchAttemptedRef.current = true;
    
    try {
      // Convert filters to query string
      const params = new URLSearchParams();
      
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
      if (filters.amenities && filters.amenities.length) 
        params.append('amenities', filters.amenities.join(','));
      
      const queryString = params.toString();
      const url = `/api/properties${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        // Add cache control headers to prevent browser caching
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle multiple response formats safely
      let fetchedProperties = [];
      if (Array.isArray(data)) {
        fetchedProperties = data;
      } else if (data && typeof data === 'object') {
        // Check for properties array or use the whole object if it looks like a property
        if (Array.isArray(data.properties)) {
          fetchedProperties = data.properties;
        } else if (data.id && data.title) {
          // Single property object
          fetchedProperties = [data];
        }
      }
      
      console.log('MapComponent: Successfully fetched properties:', fetchedProperties.length);
      
      if (fetchedProperties.length > 0) {
        setProperties(fetchedProperties);
        updateCache(fetchedProperties);
      } else if (propProperties.length > 0) {
        // Fallback to prop properties if nothing found
        setProperties(propProperties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      // If fetch fails, fall back to prop properties
      if (propProperties.length > 0) {
        setProperties(propProperties);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, propProperties, checkAndLoadCache, updateCache]);
  
  // Use the memoized fetch function in useEffect
  useEffect(() => {
    // Convert current filters to string for comparison
    const currentFiltersStr = JSON.stringify(filters);
    
    // Check if filters changed - if so, we need to reset and refetch
    if (prevFiltersRef.current !== currentFiltersStr) {
      fetchAttemptedRef.current = false;
      prevFiltersRef.current = currentFiltersStr;
    }
    
    // For homepage map with disableAutoFetch=true, we still want to show map features but not fetch
    if (disableAutoFetch) {
      // Only display explicitly provided properties when disableAutoFetch is true
      if (propProperties.length > 0) {
        setProperties(propProperties);
      }
      return;
    }
    
    // Always use prop-provided properties if available
    if (propProperties.length > 0) {
      setProperties(propProperties);
      return;
    }
    
    // Only proceed with fetch if we have active filters or need properties
    // and haven't already fetched in this render cycle
    if (!fetchAttemptedRef.current) {
      // First try to load from cache
      const cacheLoaded = checkAndLoadCache();
      
      // If cache failed, do a fresh fetch
      if (!cacheLoaded) {
        fetchFilteredProperties();
      }
    }
    
    // No cleanup function - fetchAttemptedRef handles duplicate fetches
  }, [filters, propProperties, disableAutoFetch, checkAndLoadCache]);
  
  // Handle property click
  const handlePropertyClick = (property: Property) => {
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  return (
    <div style={{ height, width }} className="rounded-lg overflow-hidden shadow-md">
      {loading && (
        <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center p-2 z-[1000]">
          Loading properties...
        </div>
      )}
      
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedProperty && (
          <SetViewOnSelect
            coords={[selectedProperty.latitude, selectedProperty.longitude]}
          />
        )}

        {/* Render University Markers */}
        {showUniversities && universities.map((uni) => (
          <Marker
            key={uni.id}
            position={[uni.lat, uni.lng]}
            icon={createUniversityIcon(uni.color)}
          >
            <Popup>
              <div>
                <h3 className="font-semibold text-sm">{uni.name}</h3>
                <p className="text-xs text-gray-600">{t('universityLabel') || 'University'}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Tube Station Markers */}
        {showTubeStations && (
          <>
            {/* Default tube stations */}
            {tubeStations.map((station) => (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={createTubeStationIcon()}
              >
                <Popup>
                  <div>
                    <h3 className="font-semibold text-sm">{station.name}</h3>
                    <p className="text-xs text-gray-600">{t('tubeStationLabel') || 'Tube Station'}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Transport nodes from database */}
            {transportNodes.map((node) => (
              <Marker
                key={node.id}
                position={[node.latitude, node.longitude]}
                icon={createTubeStationIcon()}
              >
                <Popup>
                  <div>
                    <h3 className="font-semibold text-sm">{node.name}</h3>
                    <p className="text-xs text-gray-600">{t('transportNodeLabel') || 'Transport Node'}</p>
                    {node.lines && <p className="text-xs text-gray-600">Lines: {node.lines}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}

        {/* Render Landmark Markers */}
        {showLandmarks && landmarks.map((landmark) => (
          <Marker
            key={landmark.id}
            position={[landmark.lat, landmark.lng]}
            icon={createLandmarkIcon(landmark.type)}
          >
            <Popup>
              <div>
                <h3 className="font-semibold text-sm">{landmark.name}</h3>
                <p className="text-xs text-gray-600">{t('landmarkLabel') || 'Landmark'}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Park Markers */}
        {showParks && parks.map((park) => (
          <Marker
            key={park.id}
            position={[park.lat, park.lng]}
            icon={createParkIcon(park.size)}
          >
            <Popup>
              <div>
                <h3 className="font-semibold text-sm">{park.name}</h3>
                <p className="text-xs text-gray-600">{t('parkLabel') || 'Park'}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Neighborhood Markers */}
        {showNeighborhoods && londonNeighborhoods.map((neighborhood) => (
          <Marker
            key={neighborhood.id}
            position={[neighborhood.lat, neighborhood.lng]}
            icon={createNeighborhoodIcon(neighborhood.type)}
          >
            <Popup>
              <div>
                <h3 className="font-semibold text-sm">{neighborhood.name}</h3>
                <p className="text-xs text-gray-600">
                  {neighborhood.type === "student-area" 
                    ? (t('studentAreaLabel') || 'Student Area')
                    : neighborhood.type === "academic" 
                      ? (t('academicAreaLabel') || 'Academic Area')
                      : neighborhood.type === "residential"
                        ? (t('residentialAreaLabel') || 'Residential Area')
                        : neighborhood.type === "entertainment"
                          ? (t('entertainmentAreaLabel') || 'Entertainment District')
                          : neighborhood.type === "transport-hub"
                            ? (t('transportHubLabel') || 'Transport Hub')
                            : (t('neighborhoodLabel') || 'Neighborhood')}
                </p>
                {neighborhood.description && (
                  <p className="text-xs text-gray-500 mt-1">{neighborhood.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Shopping Areas */}
        {showShoppingAreas && shoppingAreas.map((area) => (
          <Marker
            key={area.id}
            position={[area.lat, area.lng]}
            icon={createShoppingIcon(area.type)}
          >
            <Popup>
              <div>
                <h3 className="font-semibold text-sm">{area.name}</h3>
                <p className="text-xs text-gray-600">
                  {area.type === "shopping-street" 
                    ? (t('shoppingStreetLabel') || 'Shopping Street')
                    : area.type === "shopping-market" 
                      ? (t('shoppingMarketLabel') || 'Market')
                      : area.type === "food-market"
                        ? (t('foodMarketLabel') || 'Food Market')
                        : (t('shoppingCenterLabel') || 'Shopping Center')}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Draggable marker for property form */}
        {markerPosition && onMarkerChange && (
          <Marker
            position={markerPosition}
            icon={createPropertyIcon(true)}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                onMarkerChange(position.lat, position.lng);
              },
            }}
          >
            <Popup>
              <div>
                <h3 className="font-semibold text-sm">{t('propertyLocation')}</h3>
                <p className="text-xs text-gray-600">
                  Lat: {markerPosition[0].toFixed(6)}, Lng: {markerPosition[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Map click handler for setting marker position */}
        {onMarkerChange && !markerPosition && (
          <MapEvents onMapClick={(e) => onMarkerChange(e.latlng.lat, e.latlng.lng)} />
        )}

        {/* Render Property Markers */}
        {properties && properties.length > 0 ? (
          properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createPropertyIcon(
                selectedProperty ? selectedProperty.id === property.id : false,
                property.price
              )}
              eventHandlers={{
                click: () => handlePropertyClick(property),
              }}
            >
              <Popup>
                <div className="max-w-xs">
                  <h3 className="font-semibold truncate">{property.title}</h3>
                  <p className="text-sm font-medium text-blue-600">
                    {formatCurrency(property.price)}
                    <span className="text-gray-600 font-normal">
                      {' '}
                      / {t('month')}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {property.address}
                  </p>
                  {property.images && property.images.length > 0 && (
                    <div className="mt-2 relative w-full h-24">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        sizes="100%"
                        className="object-cover rounded"
                        style={{objectFit: "cover"}}
                      />
                    </div>
                  )}
                  <div className="mt-2">
                    <Link 
                      href={`/${params.locale || 'en'}/properties/${property.id}`} 
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      {t('viewProperty')}
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        ) : (
          <div className="leaflet-container-custom-message">
            {/* No visible message, just for debugging */}
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

