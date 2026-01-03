# Indian Destinations Setup

## Overview
Added comprehensive Indian destinations with rupee-based pricing to the WanderWise application.

## Added Destinations

### 🏙️ Major Cities (10 destinations)
1. **Mumbai** - Financial capital, Bollywood, street food
2. **Delhi** - Capital city, Red Fort, India Gate
3. **Goa** - Beaches, Portuguese heritage, nightlife
4. **Jaipur** - Pink City, palaces, Rajasthani culture
5. **Kerala (Kochi)** - Backwaters, spice plantations, Ayurveda
6. **Agra** - Taj Mahal, Mughal architecture
7. **Varanasi** - Spiritual capital, Ganges ghats
8. **Udaipur** - City of Lakes, romantic palaces
9. **Rishikesh** - Yoga capital, adventure sports
10. **Hampi** - UNESCO site, ancient ruins

### 🎯 Activities Added (60+ activities)
Each destination includes 5-6 authentic activities with:
- **Rupee pricing** (₹) instead of dollars
- **Realistic costs** based on actual Indian prices
- **Cultural experiences** specific to each region
- **Adventure activities** like rafting, bungee jumping
- **Food tours** featuring local cuisines
- **Historical sites** and monuments
- **Spiritual experiences** and temple visits

## Currency Display Updates

### Frontend Changes Made
1. **ActivityPopup.tsx** - Shows ₹ for Indian destinations
2. **Explore.tsx** - Displays rupee pricing in activity cards
3. **TripView.tsx** - Shows rupee costs in trip itineraries

### Currency Logic
```typescript
// Automatically detects Indian destinations and shows rupees
{city?.country === 'India' ? `₹${activity.estimated_cost}` : `$${activity.estimated_cost}`}
```

## Sample Pricing (in Rupees)

### Free Activities (₹0)
- Gateway of India visit
- Marine Drive walk
- India Gate visit
- Lotus Temple
- Ganga Aarti ceremonies

### Budget Activities (₹50-500)
- Red Fort tour (₹50)
- Hawa Mahal (₹50)
- Temple visits (₹30-200)
- Ganges boat rides (₹500)

### Mid-range Activities (₹500-2000)
- Street food tours (₹600-800)
- Spice plantation visits (₹800)
- Ayurvedic treatments (₹1200-2000)
- Cultural shows (₹1000)

### Premium Activities (₹2000+)
- Hot air balloon rides (₹8000)
- Houseboat stays (₹6000)
- Adventure sports (₹2000-3500)

## Database Migration

### To Apply the Migration:
1. **Via Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/20260103120000_add_indian_destinations.sql`
   - Run the migration

2. **Via Supabase CLI:**
   ```bash
   supabase db push
   ```

### Migration Contents:
- **10 Indian cities** with proper coordinates and descriptions
- **60+ activities** across all destinations
- **Realistic rupee pricing** for all activities
- **High-quality Unsplash images** for each destination
- **Proper categorization** (sightseeing, culture, food, adventure, etc.)

## Features Implemented

### 🌟 Enhanced User Experience
- **Automatic currency detection** based on destination country
- **Localized pricing** showing rupees for Indian destinations
- **Cultural authenticity** with region-specific activities
- **Comprehensive coverage** of India's top tourist destinations

### 🎨 Visual Improvements
- **Beautiful destination images** from Unsplash
- **Proper cost indexing** reflecting Indian price levels
- **Accurate ratings** based on popular tourist feedback
- **Detailed descriptions** for each destination

### 🔧 Technical Features
- **Seamless integration** with existing codebase
- **No breaking changes** to current functionality
- **Backward compatibility** maintained
- **Proper database relationships** preserved

## Usage Examples

### Explore Indian Destinations
1. Go to Explore page
2. Browse the new Indian cities
3. Click "View Activities" on any Indian destination
4. See activities priced in rupees (₹)

### Add to Trip
1. Create a new trip
2. Add Indian destinations like Mumbai, Delhi, Goa
3. Click "Add Activities" on any Indian stop
4. Select from authentic local experiences
5. See costs displayed in rupees

## Cost Comparison
- **Street food tour in Mumbai**: ₹800 (~$10)
- **Taj Mahal visit**: ₹1100 (~$13)
- **Kerala houseboat**: ₹6000 (~$72)
- **Hot air balloon in Jaipur**: ₹8000 (~$96)

This provides realistic pricing that reflects the actual cost of travel in India, making trip planning more accurate for users visiting Indian destinations.

## Next Steps
1. Apply the database migration
2. Test the new destinations in the application
3. Verify rupee pricing displays correctly
4. Consider adding more regional Indian destinations based on user feedback