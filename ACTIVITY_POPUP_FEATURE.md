# Activity Popup Feature

## Overview
Added a reusable ActivityPopup component that allows users to view and add activities to their trips from both the Explore page and Trip Builder.

## Features

### 1. Explore Page Integration
- **"View Activities" button** on each city card
- Opens popup showing all activities available in that city
- **Read-only mode** for exploration and discovery
- Activities displayed with:
  - Name and description
  - Category badge with color coding
  - Estimated cost, duration, and rating
  - Activity image (if available)

### 2. Trip Builder Integration
- **"Add Activities" button** on each destination stop
- Opens popup in **trip-edit mode** with checkboxes
- Shows existing activities with checkmarks
- Allows selection of new activities to add
- **Bulk add functionality** - add multiple activities at once
- Prevents duplicate additions

### 3. Activity Popup Component (`ActivityPopup.tsx`)

#### Props
```typescript
interface ActivityPopupProps {
  isOpen: boolean;
  onClose: () => void;
  city: City | null;
  tripStopId?: string; // For trip editing mode
  selectedActivityIds?: string[]; // Already selected activities
  onActivitiesSelected?: (activityIds: string[]) => void;
  mode?: 'explore' | 'trip-edit';
}
```

#### Features
- **Responsive design** with scrollable content
- **Category color coding** for easy identification
- **Activity details** display (cost, duration, rating)
- **Checkbox selection** in trip-edit mode
- **Bulk operations** with selection counter
- **Error handling** with toast notifications
- **Loading states** for better UX

## Database Integration

### Tables Used
- `activities` - Activity data with city relationships
- `trip_activities` - Junction table linking activities to trip stops
- `trip_stops` - Trip destinations
- `cities` - City/destination data

### Activity Categories
- Sightseeing (blue)
- Food (orange)
- Adventure (red)
- Culture (purple)
- Nature (green)
- Shopping (pink)
- Nightlife (indigo)
- Relaxation (teal)

## Usage Examples

### Explore Page
```typescript
<ActivityPopup
  isOpen={activityPopupOpen}
  onClose={() => setActivityPopupOpen(false)}
  city={selectedCityForActivities}
  mode="explore"
/>
```

### Trip Builder
```typescript
<ActivityPopup
  isOpen={activityPopupOpen}
  onClose={() => setActivityPopupOpen(false)}
  city={selectedStopForActivities?.city || null}
  tripStopId={selectedStopForActivities?.id}
  selectedActivityIds={existingActivityIds}
  onActivitiesSelected={handleActivitiesSelected}
  mode="trip-edit"
/>
```

## User Experience Flow

### From Explore Page
1. User browses destinations in Explore
2. Clicks "View Activities" on a city card
3. Popup opens showing all activities in that city
4. User can browse activities to learn about the destination
5. Close popup to continue exploring

### From Trip Builder
1. User is building their trip itinerary
2. Clicks "Add Activities" on a destination stop
3. Popup opens with checkboxes for activity selection
4. Existing activities are marked with checkmarks
5. User selects new activities to add
6. Clicks "Add to Trip" to save selections
7. Activities are added to the trip stop
8. Success notification confirms the action

## Technical Implementation

### State Management
- Local state for popup visibility and selected activities
- Supabase queries for fetching activities and managing selections
- Toast notifications for user feedback

### Performance Considerations
- Activities loaded on-demand when popup opens
- Efficient queries with proper indexing
- Minimal re-renders with proper state management

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly content
- Focus management for modal dialogs

## Future Enhancements
- Activity filtering and search within popup
- Activity recommendations based on user preferences
- Custom activity creation
- Activity scheduling with time slots
- Activity reviews and ratings
- Photo galleries for activities