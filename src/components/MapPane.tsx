'use client'; // Required for Leaflet components

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet library

// Manual type definition for properties passed to the map
// Should match the FetchedProperty type defined in the parent page (e.g., SearchPage)
interface MapProperty {
  id: string;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  // Add other fields if needed for popups or markers
}

interface University {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null; // Add optional address field
}

interface TransportNode {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  lines?: string | null;
}

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
});

// --- Define Custom Icons (Basic Examples) ---

// Default property icon (standard blue marker)
const defaultIcon = L.icon({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Placeholder University Icon (e.g., using a simple divIcon or a custom image URL)
// For simplicity, we'll reuse the default icon but ideally use a different one.
const universityIcon = L.icon({ 
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwNjhjMCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMiAyTDIgN3YyYzAgNS41NSA0LjQyIDEwIDEwIDEwIDEuOTYgMCAzLjgxLS41NyA1LjM2LTEuNTZsLTMuNjEtMy42MUw5LjUgMTIuNzRsLTIuNDctMi40N2MuNDctLjQ1IDEuMDEtLjc5IDEuNjEtMS4wNmwxLjQ1IDEuNDUgMi4yNC0yLjIzYy43NC0uMjQgMS41My0uMzYgMi4zNC0uMzYgMi43NiAwIDUgMi4yNCA1IDV2M2w1LTQuNTV2LTcuNUwxMiAyek03LjMzIDguNzlsNC42NyA0LjY3TDE1IDExLjV2LTNjMC0xLjY5LTEuMzUtMy0zLTNzLTMgMS4zNS0zIDN2MS44NnoiLz48L3N2Zz4=', // Simple graduation cap SVG (encoded)
    iconSize: [24, 24], // Adjust size
    iconAnchor: [12, 24], // Adjust anchor
    popupAnchor: [0, -24]
});

// Placeholder Transport Icon (e.g., Tube symbol)
const transportIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMi4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBmaWxsPSIjYjIwMDI1Ij4gIGQ9Ik0yNTYgMEMxMTQuNiAwIDAgMTE0LjYgMCAyNTZzMTE0LjYgMjU2IDI1NiAyNTZzMjU2LTExNC42IDI1Ni0yNTZTMzk3LjQgMCAyNTYgMHpNMjg4LjMgNDEzLjlMMjIzLjcgNDE0Yy02LjYgMC0xMi01LjQtMTItMTJWMjYwLjVjMC0xMS40IDkuMy0yMC43IDIwLjctMjAuN0gzMDljMTEuNCAwIDIwLjcgOS4zIDIwLjcgMjAuN3YxNDEuNEMzMzAuMSAzOTIgMzIyLjIgNDE0IDI4OC4zIDQxMy45ek00MDMuMSAyNjAuNXYxNDEuNGMwIDYtMy44IDExLjMtOS4zIDEzLjVsLTczLjEgMjMuNWMtNy4xIDIuMy0xNC42IDEuOC0yMS4xLTEuM2wtNTEuOS0yMy43Yy0zLjItMS41LTUuMy00LjgtNS4zLTguNFYyNjAuNWMwLTExLjQgOS4zLTIwLjcgMjAuNy0yMC43SDM4Mi41YzExLjQgMCAyMC43IDkuMyAyMC43IDIwLjd6Ii8+PC9zdmc+', // Simple train SVG (encoded)
    iconSize: [20, 20], // Adjust size
    iconAnchor: [10, 10], // Adjust anchor
    popupAnchor: [0, -10]
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

interface MapPaneProps {
  properties: MapProperty[];
  universities?: University[]; // Make overlays optional
  transportNodes?: TransportNode[]; // Make overlays optional
  center?: [number, number];
  zoom?: number;
}

const MapPane: React.FC<MapPaneProps> = ({ 
  properties,
  universities = [], // Default to empty array
  transportNodes = [], // Default to empty array
  center = [51.505, -0.09], 
  zoom = 11 
}) => {

  // Basic validation
  if (!Array.isArray(properties)) {
    console.error('MapPane received invalid properties prop:', properties);
    return <div className="w-full md:w-3/4 h-[calc(100vh-theme(space.16))] flex items-center justify-center bg-red-100 text-red-700">Error: Invalid properties data</div>;
  }

  return (
    <div className="w-full md:w-3/4 h-[calc(100vh-theme(space.16))]" > {/* Adjust height as needed */}
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Property Markers */}
        {properties.map((property) => (
          isValidCoordinate(property.latitude, property.longitude) ? (
            <Marker key={`prop-${property.id}`} position={[property.latitude, property.longitude]} icon={defaultIcon}>
              <Popup>
                <div className="font-semibold">{property.title}</div>
                <div>£{property.price.toLocaleString()} pcm</div>
                 {/* Link to property details */} 
                 <a href={`/property/${property.id}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">View Details</a>
              </Popup>
            </Marker>
          ) : null
        ))}

        {/* University Markers (using LayerGroup) */}
        <LayerGroup>
           {universities.map((uni) => (
            isValidCoordinate(uni.latitude, uni.longitude) ? (
                <Marker key={`uni-${uni.id}`} position={[uni.latitude, uni.longitude]} icon={universityIcon}>
                <Popup>
                    <div className="font-semibold">{uni.name}</div>
                    {uni.address && <div className="text-sm text-gray-600">{uni.address}</div>}
                </Popup>
                </Marker>
            ) : null
            ))}
        </LayerGroup>

        {/* Transport Node Markers (using LayerGroup) */}
        <LayerGroup>
            {transportNodes.map((node) => (
                 isValidCoordinate(node.latitude, node.longitude) ? (
                    <Marker key={`trans-${node.id}`} position={[node.latitude, node.longitude]} icon={transportIcon}>
                    <Popup>
                         <div className="font-semibold">{node.name}</div>
                         <div className="text-sm text-gray-600">Type: {node.type}</div>
                         {node.lines && <div className="text-sm text-gray-600">Lines: {node.lines}</div>}
                    </Popup>
                    </Marker>
                 ) : null
            ))}
        </LayerGroup>

      </MapContainer>
    </div>
  );
};

export default MapPane;