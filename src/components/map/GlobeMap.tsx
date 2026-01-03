import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Marker {
  lat: number;
  lng: number;
  name: string;
  color?: string;
}

interface GlobeMapProps {
  markers?: Marker[];
  routes?: Array<{ from: [number, number]; to: [number, number] }>;
  mapboxToken?: string; // Kept for compatibility but not used
  onTokenSubmit?: (token: string) => void; // Kept for compatibility but not used
  className?: string;
  interactive?: boolean;
}

export function GlobeMap({ 
  markers = [], 
  routes = [],
  className = '',
  interactive = true
}: GlobeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routesRef = useRef<L.Polyline[]>([]);

  // Create custom marker icon
  const createCustomIcon = (color: string = '#2563eb') => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: interactive,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      scrollWheelZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map.current);

    // Add zoom control to top-right if interactive
    if (interactive && map.current) {
      map.current.zoomControl.setPosition('topright');
    }

    return () => {
      // Cleanup
      markersRef.current.forEach(marker => marker.remove());
      routesRef.current.forEach(route => route.remove());
      markersRef.current = [];
      routesRef.current = [];
      map.current?.remove();
    };
  }, [interactive]);

  // Update markers when they change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      const marker = L.marker([markerData.lat, markerData.lng], {
        icon: createCustomIcon(markerData.color)
      })
        .bindPopup(`<div class="font-semibold text-sm">${markerData.name}</div>`)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds if we have markers
    if (markers.length > 1 && map.current) {
      const group = new L.FeatureGroup(markersRef.current);
      map.current.fitBounds(group.getBounds().pad(0.1));
    } else if (markers.length === 1 && map.current) {
      map.current.setView([markers[0].lat, markers[0].lng], 6);
    }
  }, [markers]);

  // Update routes when they change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing routes
    routesRef.current.forEach(route => route.remove());
    routesRef.current = [];

    // Add new routes
    routes.forEach(route => {
      const polyline = L.polyline([
        [route.from[1], route.from[0]], // Leaflet uses [lat, lng]
        [route.to[1], route.to[0]]
      ], {
        color: '#2563eb',
        weight: 3,
        opacity: 0.8,
      }).addTo(map.current!);

      routesRef.current.push(polyline);
    });

    // Fit bounds to include routes and markers
    if ((markers.length > 0 || routes.length > 0) && map.current) {
      const allFeatures = [...markersRef.current, ...routesRef.current];
      if (allFeatures.length > 0) {
        const group = new L.FeatureGroup(allFeatures);
        map.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [routes, markers.length]);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-lg" />
    </div>
  );
}