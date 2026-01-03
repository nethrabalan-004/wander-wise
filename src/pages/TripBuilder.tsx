import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlobeMap } from '@/components/map/GlobeMap';
import { ActivityPopup } from '@/components/activities/ActivityPopup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Loader2, 
  Plus,
  Trash2,
  GripVertical,
  MapPin,
  Search,
  ArrowRight,
  Save,
  Star
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  cost_index: number;
}

interface TripStop {
  id: string;
  trip_id: string;
  city_id: string;
  arrival_date: string;
  departure_date: string;
  order_index: number;
  notes: string | null;
  city?: City;
}

interface Profile {
  mapbox_token: string | null;
}

export default function TripBuilder() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Activity popup state
  const [activityPopupOpen, setActivityPopupOpen] = useState(false);
  const [selectedStopForActivities, setSelectedStopForActivities] = useState<TripStop | null>(null);
  const [existingActivityIds, setExistingActivityIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user || !tripId) return;
    
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('mapbox_token')
        .eq('user_id', user.id)
        .maybeSingle();
      setProfile(profileData);

      // Fetch trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (tripError || !tripData) {
        toast({
          title: 'Error',
          description: 'Trip not found or access denied.',
          variant: 'destructive',
        });
        navigate('/trips');
        return;
      }
      setTrip(tripData);

      // Fetch stops with city data
      const { data: stopsData } = await supabase
        .from('trip_stops')
        .select(`
          *,
          cities (*)
        `)
        .eq('trip_id', tripId)
        .order('order_index');

      const formattedStops = (stopsData || []).map(stop => ({
        ...stop,
        city: stop.cities as unknown as City
      }));
      setStops(formattedStops);

      // Fetch all cities
      const { data: citiesData } = await supabase
        .from('cities')
        .select('*')
        .order('popularity_rating', { ascending: false });
      setCities(citiesData || []);

      setLoading(false);
    };

    fetchData();
  }, [user, tripId, navigate, toast]);

  const handleTokenSubmit = async (token: string) => {
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ mapbox_token: token })
      .eq('user_id', user.id);
    setProfile({ ...profile, mapbox_token: token });
  };

  const addStop = async (city: City) => {
    if (!trip) return;
    
    const newOrderIndex = stops.length;
    const arrivalDate = stops.length > 0 
      ? stops[stops.length - 1].departure_date 
      : trip.start_date;
    
    // Calculate a default departure date (3 days after arrival)
    const arrival = new Date(arrivalDate);
    const departure = new Date(arrival);
    departure.setDate(departure.getDate() + 3);
    
    // Ensure departure doesn't exceed trip end date
    const tripEnd = new Date(trip.end_date);
    const departureDate = departure > tripEnd ? trip.end_date : format(departure, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('trip_stops')
      .insert({
        trip_id: trip.id,
        city_id: city.id,
        arrival_date: arrivalDate,
        departure_date: departureDate,
        order_index: newOrderIndex,
      })
      .select(`*, cities (*)`)
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add stop.',
        variant: 'destructive',
      });
    } else {
      setStops([...stops, { ...data, city: data.cities as unknown as City }]);
      setAddDialogOpen(false);
      toast({
        title: 'Stop Added',
        description: `${city.name} has been added to your trip.`,
      });
    }
  };

  const removeStop = async (stopId: string) => {
    const { error } = await supabase
      .from('trip_stops')
      .delete()
      .eq('id', stopId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove stop.',
        variant: 'destructive',
      });
    } else {
      setStops(stops.filter(s => s.id !== stopId));
      toast({
        title: 'Stop Removed',
        description: 'The destination has been removed from your trip.',
      });
    }
  };

  const updateStopDates = async (stopId: string, arrivalDate: Date | undefined, departureDate: Date | undefined) => {
    const stopIndex = stops.findIndex(s => s.id === stopId);
    if (stopIndex === -1) return;

    const updatedStops = [...stops];
    if (arrivalDate) {
      updatedStops[stopIndex].arrival_date = format(arrivalDate, 'yyyy-MM-dd');
    }
    if (departureDate) {
      updatedStops[stopIndex].departure_date = format(departureDate, 'yyyy-MM-dd');
    }
    setStops(updatedStops);

    await supabase
      .from('trip_stops')
      .update({
        arrival_date: updatedStops[stopIndex].arrival_date,
        departure_date: updatedStops[stopIndex].departure_date,
      })
      .eq('id', stopId);
  };

  const handleSaveAndContinue = () => {
    toast({
      title: 'Itinerary Saved',
      description: 'Your trip has been updated.',
    });
    navigate(`/trips/${tripId}`);
  };

  const handleOpenActivityPopup = async (stop: TripStop) => {
    if (!stop.city) return;
    
    // Fetch existing activities for this stop
    const { data: existingActivities } = await supabase
      .from('trip_activities')
      .select('activity_id')
      .eq('trip_stop_id', stop.id);
    
    setExistingActivityIds(existingActivities?.map(a => a.activity_id) || []);
    setSelectedStopForActivities(stop);
    setActivityPopupOpen(true);
  };

  const handleActivitiesSelected = () => {
    // Refresh the page or update state as needed
    toast({
      title: 'Activities Updated',
      description: 'Activities have been added to your trip.',
    });
    setActivityPopupOpen(false);
  };

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

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {trip?.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Build your itinerary by adding destinations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/trips')}>
              Cancel
            </Button>
            <Button onClick={handleSaveAndContinue} className="gradient-ocean gap-2">
              <Save className="h-4 w-4" />
              Save & View Trip
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Stops List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Destinations</h2>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Stop
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Destination</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search cities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                      {filteredCities.slice(0, 20).map((city) => (
                        <div
                          key={city.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => addStop(city)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{city.name}</p>
                              <p className="text-sm text-muted-foreground">{city.country}</p>
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {stops.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center mb-4">
                    No destinations added yet.<br />
                    Start building your itinerary!
                  </p>
                  <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Destination
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {stops.map((stop, index) => (
                  <Card key={stop.id} className="animate-fade-in">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-ocean text-white text-sm font-semibold">
                            {index + 1}
                          </div>
                          {index < stops.length - 1 && (
                            <div className="w-0.5 h-8 bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{stop.city?.name}</h3>
                              <p className="text-sm text-muted-foreground">{stop.city?.country}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeStop(stop.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Arrival</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                    {format(new Date(stop.arrival_date), 'MMM d')}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={new Date(stop.arrival_date)}
                                    onSelect={(date) => updateStopDates(stop.id, date, undefined)}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Departure</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                    {format(new Date(stop.departure_date), 'MMM d')}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={new Date(stop.departure_date)}
                                    onSelect={(date) => updateStopDates(stop.id, undefined, date)}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleOpenActivityPopup(stop)}
                            >
                              <Star className="h-4 w-4 mr-2" />
                              Add Activities
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <Card className="overflow-hidden h-fit lg:sticky lg:top-24">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg">Trip Route</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <GlobeMap
                markers={markers}
                routes={routes}
                mapboxToken={profile?.mapbox_token || undefined}
                onTokenSubmit={handleTokenSubmit}
                className="h-[400px]"
                interactive={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Popup */}
      <ActivityPopup
        isOpen={activityPopupOpen}
        onClose={() => setActivityPopupOpen(false)}
        city={selectedStopForActivities?.city || null}
        tripStopId={selectedStopForActivities?.id}
        selectedActivityIds={existingActivityIds}
        onActivitiesSelected={handleActivitiesSelected}
        mode="trip-edit"
      />
    </MainLayout>
  );
}
