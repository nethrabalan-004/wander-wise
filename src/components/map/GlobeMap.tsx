import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe, Key } from 'lucide-react';

interface Marker {
  lat: number;
  lng: number;
  name: string;
  color?: string;
}

interface GlobeMapProps {
  markers?: Marker[];
  routes?: Array<{ from: [number, number]; to: [number, number] }>;
  mapboxToken?: string;
  onTokenSubmit?: (token: string) => void;
  className?: string;
  interactive?: boolean;
}

export function GlobeMap({ 
  markers = [], 
  routes = [],
  mapboxToken,
  onTokenSubmit,
  className = '',
  interactive = true
}: GlobeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(!mapboxToken);

  const handleTokenSubmit = () => {
    if (tokenInput.trim() && onTokenSubmit) {
      onTokenSubmit(tokenInput.trim());
      setShowTokenInput(false);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [30, 20],
        pitch: 30,
      });

      if (interactive) {
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );
      } else {
        map.current.scrollZoom.disable();
        map.current.dragPan.disable();
        map.current.doubleClickZoom.disable();
      }

      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });

        // Add routes if provided
        if (routes.length > 0 && map.current) {
          const routeCoordinates = routes.flatMap(route => [route.from, route.to]);
          
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            }
          });

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#2563eb',
              'line-width': 3,
              'line-opacity': 0.8
            }
          });
        }
      });

      // Auto-rotation for non-interactive globe
      if (!interactive) {
        const secondsPerRevolution = 180;
        let userInteracting = false;

        function spinGlobe() {
          if (!map.current) return;
          
          const zoom = map.current.getZoom();
          if (!userInteracting && zoom < 5) {
            let distancePerSecond = 360 / secondsPerRevolution;
            const center = map.current.getCenter();
            center.lng -= distancePerSecond;
            map.current.easeTo({ center, duration: 1000, easing: (n) => n });
          }
        }

        map.current.on('moveend', () => {
          spinGlobe();
        });

        spinGlobe();
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, [mapboxToken, interactive, routes]);

  // Add markers when they change
  useEffect(() => {
    if (!map.current || !mapboxToken) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-transform hover:scale-125';
      el.style.backgroundColor = markerData.color || '#2563eb';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([markerData.lng, markerData.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="font-semibold text-sm">${markerData.name}</div>`
          )
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds if we have markers
    if (markers.length > 1 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach(m => bounds.extend([m.lng, m.lat]));
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 5 });
    } else if (markers.length === 1 && map.current) {
      map.current.flyTo({ center: [markers[0].lng, markers[0].lat], zoom: 4 });
    }
  }, [markers, mapboxToken]);

  if (showTokenInput || !mapboxToken) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted rounded-lg p-8 ${className}`}>
        <Globe className="h-16 w-16 text-muted-foreground mb-4 animate-pulse-soft" />
        <h3 className="font-display text-lg font-semibold mb-2">Enable Interactive Maps</h3>
        <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
          Enter your Mapbox public token to enable the interactive globe visualization.
          Get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
        </p>
        <div className="flex gap-2 w-full max-w-md">
          <Input
            type="text"
            placeholder="pk.eyJ1IjoieW91..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTokenSubmit} className="gap-2">
            <Key className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-lg" />
    </div>
  );
}
