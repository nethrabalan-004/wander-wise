import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlobeMap } from '@/components/map/GlobeMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays } from 'date-fns';
import { 
  Loader2, 
  Calendar,
  MapPin,
  Clock,
  Copy,
  Plane,
  Twitter,
  Facebook,
  Share2
} from 'lucide-react';

interface Trip {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  cover_image_url: string | null;
}

interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface TripStop {
  id: string;
  arrival_date: string;
  departure_date: string;
  order_index: number;
  city?: City;
}

interface Activity {
  id: string;
  name: string;
  category: string;
  estimated_cost: number;
}

interface TripActivity {
  id: string;
  trip_stop_id: string;
  custom_cost: number | null;
  activity?: Activity;
}

export default function SharedTrip() {
  const { shareToken } = useParams<{ shareToken: string }>();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [activities, setActivities] = useState<TripActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!shareToken) return;
    
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch trip by share token
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('share_token', shareToken)
        .eq('is_public', true)
        .maybeSingle();

      if (tripError || !tripData) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setTrip(tripData);

      // Fetch stops with city data
      const { data: stopsData } = await supabase
        .from('trip_stops')
        .select(`*, cities (*)`)
        .eq('trip_id', tripData.id)
        .order('order_index');

      const formattedStops = (stopsData || []).map(stop => ({
        ...stop,
        city: stop.cities as unknown as City
      }));
      setStops(formattedStops);

      // Fetch activities
      if (stopsData && stopsData.length > 0) {
        const stopIds = stopsData.map(s => s.id);
        const { data: activitiesData } = await supabase
          .from('trip_activities')
          .select(`*, activities (*)`)
          .in('trip_stop_id', stopIds);

        const formattedActivities = (activitiesData || []).map(act => ({
          ...act,
          activity: act.activities as unknown as Activity
        }));
        setActivities(formattedActivities);
      }

      setLoading(false);
    };

    fetchData();
  }, [shareToken]);

  const markers = stops
    .filter(s => s.city)
    .map(s => ({
      lat: Number(s.city!.latitude),
      lng: Number(s.city!.longitude),
      name: s.city!.name,
    }));

  const routes = stops.length > 1 
    ? stops.slice(0, -1).map((stop, i) => ({
        from: [Number(stop.city?.longitude), Number(stop.city?.latitude)] as [number, number],
        to: [Number(stops[i + 1].city?.longitude), Number(stops[i + 1].city?.latitude)] as [number, number],
      }))
    : [];

  const shareOnTwitter = () => {
    if (!trip) return;
    const text = encodeURIComponent(`Check out my trip: ${trip.name}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Plane className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Trip Not Found</h1>
        <p className="text-muted-foreground text-center mb-6">
          This trip doesn't exist or isn't publicly shared.
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Go to GlobeTrotter
        </Button>
      </div>
    );
  }

  const tripDuration = differenceInDays(new Date(trip.end_date), new Date(trip.start_date)) + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-ocean">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold">GlobeTrotter</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" size="icon" onClick={shareOnTwitter}>
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={shareOnFacebook}>
              <Facebook className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Hero */}
        <div 
          className="relative h-64 md:h-80 rounded-xl overflow-hidden"
          style={{ 
            backgroundImage: trip.cover_image_url 
              ? `url(${trip.cover_image_url})` 
              : 'linear-gradient(135deg, hsl(217 91% 50%), hsl(199 89% 48%))'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              {trip.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-5 w-5" />
                <span>
                  {format(new Date(trip.start_date), 'MMMM d')} - {format(new Date(trip.end_date), 'MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-5 w-5" />
                <span>{tripDuration} days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-5 w-5" />
                <span>{stops.length} destinations</span>
              </div>
            </div>
          </div>
        </div>

        {trip.description && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {trip.description}
          </p>
        )}

        {/* Map */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-display">Trip Route</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <GlobeMap
              markers={markers}
              routes={routes}
              className="h-[400px]"
              interactive={true}
            />
          </CardContent>
        </Card>

        {/* Itinerary */}
        <div>
          <h2 className="font-display text-2xl font-bold mb-6">Itinerary</h2>
          <div className="space-y-4">
            {stops.map((stop, index) => {
              const stopActivities = activities.filter(a => a.trip_stop_id === stop.id);
              const daysInCity = differenceInDays(new Date(stop.departure_date), new Date(stop.arrival_date)) + 1;
              
              return (
                <Card key={stop.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-ocean text-white font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="font-display text-2xl">
                          {stop.city?.name}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {stop.city?.country} · {daysInCity} day{daysInCity !== 1 ? 's' : ''} · {format(new Date(stop.arrival_date), 'MMM d')} - {format(new Date(stop.departure_date), 'MMM d')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {stopActivities.length > 0 && (
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {stopActivities.map((activity) => (
                          <div 
                            key={activity.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <Badge variant="outline" className="capitalize">
                              {activity.activity?.category}
                            </Badge>
                            <span className="font-medium">{activity.activity?.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <Card className="gradient-ocean text-white">
          <CardContent className="py-8 text-center">
            <h2 className="font-display text-2xl font-bold mb-2">
              Inspired by this trip?
            </h2>
            <p className="text-white/80 mb-6">
              Create your own adventure with GlobeTrotter
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              Start Planning Your Trip
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
