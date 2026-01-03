# Map Migration: Mapbox to Leaflet

## Overview
The WanderWise frontend has been successfully migrated from Mapbox GL to Leaflet for map functionality.

## Changes Made

### Dependencies
- **Removed**: `mapbox-gl` and `@types/mapbox-gl`
- **Added**: `leaflet` and `@types/leaflet`

### Component Updates
- **GlobeMap.tsx**: Completely rewritten to use Leaflet instead of Mapbox GL
- **Settings.tsx**: Updated to reflect that map tokens are no longer required

### Key Differences

#### Before (Mapbox GL)
- Required Mapbox public token
- 3D globe projection with fog effects
- Auto-rotation for non-interactive maps
- Mapbox-specific styling and controls

#### After (Leaflet)
- No token required - uses OpenStreetMap tiles
- Standard 2D map projection
- Custom marker styling with divIcons
- Standard Leaflet controls and interactions

### Features Preserved
- ✅ Marker display with popups
- ✅ Route visualization (polylines)
- ✅ Interactive/non-interactive modes
- ✅ Zoom and pan controls
- ✅ Automatic bounds fitting
- ✅ Custom marker colors
- ✅ Component interface compatibility

### Features Lost
- ❌ 3D globe projection
- ❌ Fog effects
- ❌ Auto-rotation
- ❌ Mapbox-specific styling

### Benefits
- **No API costs**: OpenStreetMap is free
- **No token management**: Simplified setup
- **Lighter bundle**: Leaflet is smaller than Mapbox GL
- **Better compatibility**: Works without external API dependencies

## Usage
The GlobeMap component interface remains the same, so existing code continues to work without changes:

```tsx
<GlobeMap
  markers={markers}
  routes={routes}
  className="h-[400px]"
  interactive={true}
/>
```

The `mapboxToken` and `onTokenSubmit` props are still accepted for backward compatibility but are no longer used.

## Development
```bash
npm install
npm run dev
```

The map will now display using OpenStreetMap tiles without requiring any configuration.