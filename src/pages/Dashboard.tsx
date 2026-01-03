import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlobeMap } from '@/components/map/GlobeMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Plane,
  Loader2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  cover_image_url: string | null;
  total_budget: number;
}

interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  cost_index: number;
  popularity_rating: number;
}

interface Profile {
  mapbox_token: string | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [recommendedCities, setRecommendedCities] = useState<City[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripMarkers, setTripMarkers] = useState<Array<{ lat: number; lng: number; name: string }>>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('mapbox_token')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setProfile(profileData);

      // Fetch user's trips
      const { data: tripsData } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })
        .limit(5);
      
      setTrips(tripsData || []);

      // Fetch trip destinations for map
      if (tripsData && tripsData.length > 0) {
        const tripIds = tripsData.map(t => t.id);
        const { data: stopsData } = await supabase
          .from('trip_stops')
          .select(`
            city_id,
            cities (
              name,
              latitude,
              longitude
            )
          `)
          .in('trip_id', tripIds);

        if (stopsData) {
          const markers = stopsData
            .filter(s => s.cities)
            .map(s => ({
              lat: Number((s.cities as any).latitude),
              lng: Number((s.cities as any).longitude),
              name: (s.cities as any).name
            }));
          setTripMarkers(markers);
        }
      }

      // Fetch recommended cities
      const { data: citiesData } = await supabase
        .from('cities')
        .select('*')
        .order('popularity_rating', { ascending: false })
        .limit(6);
      
      setRecommendedCities(citiesData || []);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleTokenSubmit = async (token: string) => {
    if (!user) return;
    
    await supabase
      .from('profiles')
      .update({ mapbox_token: token })
      .eq('user_id', user.id);
    
    setProfile({ ...profile, mapbox_token: token });
  };

  const totalBudget = trips.reduce((sum, trip) => sum + Number(trip.total_budget || 0), 0);
  const upcomingTrips = trips.filter(t => new Date(t.start_date) > new Date()).length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome back{profile ? '' : ', Traveler'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Ready to plan your next adventure?
            </p>
          </div>
          <Button 
            onClick={() => navigate('/trips/new')} 
            className="gradient-ocean gap-2 shadow-soft"
          >
            <Plus className="h-4 w-4" />
            Plan New Trip
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Trips</p>
                  <p className="text-2xl font-bold">{trips.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-forest/10">
                  <DollarSign className="h-6 w-6 text-forest" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sunset/10">
                  <MapPin className="h-6 w-6 text-sunset" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destinations</p>
                  <p className="text-2xl font-bold">{tripMarkers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Travel Wrap Card */}
        <Card className="animate-fade-in bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200" style={{ animationDelay: '175ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">2024 Travel Wrap</p>
                  <p className="text-sm text-gray-600">See your year in wanderlust!</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/travel-wrap')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
              >
                View My Wrap ✨
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Globe Map */}
        <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="font-display flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Travel Map
            </CardTitle>
            <CardDescription>
              {tripMarkers.length > 0 
                ? `You've explored ${tripMarkers.length} destinations`
                : 'Start planning to see your destinations on the globe'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <GlobeMap 
              markers={tripMarkers}
              mapboxToken={profile?.mapbox_token || undefined}
              onTokenSubmit={handleTokenSubmit}
              className="h-[400px]"
              interactive={false}
            />
          </CardContent>
        </Card>

        {/* Recent Trips & Recommended */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Trips */}
          <Card className="animate-fade-in" style={{ animationDelay: '250ms' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display">Recent Trips</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/trips')}>
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {trips.length === 0 ? (
                <div className="text-center py-8">
                  <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No trips yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/trips/new')}
                  >
                    Create your first trip
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {trips.slice(0, 4).map((trip) => (
                    <div 
                      key={trip.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/trips/${trip.id}`)}
                    >
                      <div 
                        className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ 
                          backgroundImage: trip.cover_image_url 
                            ? `url(${trip.cover_image_url})` 
                            : 'linear-gradient(135deg, hsl(217 91% 50%), hsl(199 89% 48%))'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{trip.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Destinations */}
          <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display">Popular Destinations</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>
                  Explore all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {recommendedCities.map((city) => (
                  <div 
                    key={city.id}
                    className="relative overflow-hidden rounded-lg aspect-[4/3] group cursor-pointer"
                    onClick={() => navigate(`/explore?city=${city.id}`)}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundImage: city.image_url 
                          ? `url(${city.image_url})` 
                          : 'linear-gradient(135deg, hsl(217 91% 50%), hsl(199 89% 48%))'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="font-medium text-white text-sm">{city.name}</p>
                      <p className="text-white/70 text-xs">{city.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
