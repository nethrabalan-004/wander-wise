import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlobeMap } from '@/components/map/GlobeMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';
import { 
  Loader2, 
  Edit,
  Share2,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  ChevronRight,
  Plane,
  Copy,
  Check
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Trip {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  cover_image_url: string | null;
  total_budget: number;
  is_public: boolean;
  share_token: string;
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
  city_id: string;
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
  duration_hours: number;
}

interface TripActivity {
  id: string;
  trip_stop_id: string;
  activity_id: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  custom_cost: number | null;
  is_completed: boolean;
  activity?: Activity;
}

interface TripBudget {
  category: string;
  planned_amount: number;
  spent_amount: number;
}

interface Profile {
  mapbox_token: string | null;
}

const BUDGET_COLORS = {
  transport: '#2563eb',
  accommodation: '#7c3aed',
  activities: '#f97316',
  food: '#22c55e',
  shopping: '#ec4899',
  other: '#6b7280',
};

export default function TripView() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [activities, setActivities] = useState<TripActivity[]>([]);
  const [budgets, setBudgets] = useState<TripBudget[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch profile if logged in
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('mapbox_token')
          .eq('user_id', user.id)
          .maybeSingle();
        setProfile(profileData);
      }

      // Fetch trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .maybeSingle();

      if (tripError || !tripData) {
        toast({
          title: 'Error',
          description: 'Trip not found.',
          variant: 'destructive',
        });
        navigate('/trips');
        return;
      }
      setTrip(tripData);

      // Fetch stops with city data
      const { data: stopsData } = await supabase
        .from('trip_stops')
        .select(`*, cities (*)`)
        .eq('trip_id', tripId)
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

      // Fetch budgets
      const { data: budgetsData } = await supabase
        .from('trip_budgets')
        .select('*')
        .eq('trip_id', tripId);
      setBudgets(budgetsData || []);

      setLoading(false);
    };

    fetchData();
  }, [tripId, user, navigate, toast]);

  const handleTokenSubmit = async (token: string) => {
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ mapbox_token: token })
      .eq('user_id', user.id);
    setProfile({ ...profile, mapbox_token: token });
  };

  const copyShareLink = () => {
    if (!trip) return;
    const shareUrl = `${window.location.origin}/trips/shared/${trip.share_token}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Link Copied!',
      description: 'Share this link with friends and family.',
    });
  };

  const togglePublic = async () => {
    if (!trip) return;
    
    const { error } = await supabase
      .from('trips')
      .update({ is_public: !trip.is_public })
      .eq('id', trip.id);

    if (!error) {
      setTrip({ ...trip, is_public: !trip.is_public });
      toast({
        title: trip.is_public ? 'Trip Made Private' : 'Trip Made Public',
        description: trip.is_public 
          ? 'Only you can see this trip now.'
          : 'Anyone with the link can now view this trip.',
      });
    }
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

  const totalPlanned = budgets.reduce((sum, b) => sum + Number(b.planned_amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent_amount), 0);
  const tripDuration = trip ? differenceInDays(new Date(trip.end_date), new Date(trip.start_date)) + 1 : 0;
  const totalActivitiesCost = activities.reduce((sum, a) => 
    sum + Number(a.custom_cost || a.activity?.estimated_cost || 0), 0
  );

  const pieData = budgets
    .filter(b => Number(b.planned_amount) > 0)
    .map(b => ({
      name: b.category.charAt(0).toUpperCase() + b.category.slice(1),
      value: Number(b.planned_amount),
      color: BUDGET_COLORS[b.category as keyof typeof BUDGET_COLORS] || '#6b7280',
    }));

  const barData = budgets.map(b => ({
    name: b.category.charAt(0).toUpperCase() + b.category.slice(1),
    planned: Number(b.planned_amount),
    spent: Number(b.spent_amount),
  }));

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!trip) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div 
          className="relative h-48 md:h-64 rounded-xl overflow-hidden"
          style={{ 
            backgroundImage: trip.cover_image_url 
              ? `url(${trip.cover_image_url})` 
              : 'linear-gradient(135deg, hsl(217 91% 50%), hsl(199 89% 48%))'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                  {trip.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{tripDuration} days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{stops.length} destinations</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={copyShareLink}
                  className="gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Share'}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate(`/trips/${tripId}/edit`)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {trip.description && (
          <p className="text-muted-foreground">{trip.description}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="text-lg font-bold">${Number(trip.total_budget).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Plane className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Activities</p>
                  <p className="text-lg font-bold">{activities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest/10">
                  <DollarSign className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Est. Cost</p>
                  <p className="text-lg font-bold">${totalActivitiesCost.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sunset/10">
                  <Clock className="h-5 w-5 text-sunset" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Per Day</p>
                  <p className="text-lg font-bold">
                    ${tripDuration > 0 ? Math.round(Number(trip.total_budget) / tripDuration).toLocaleString() : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="itinerary">
          <TabsList>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" className="mt-6">
            {stops.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center mb-4">
                    No destinations added yet
                  </p>
                  <Button onClick={() => navigate(`/trips/${tripId}/edit`)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Add Destinations
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {stops.map((stop, index) => {
                  const stopActivities = activities.filter(a => a.trip_stop_id === stop.id);
                  const daysInCity = differenceInDays(new Date(stop.departure_date), new Date(stop.arrival_date)) + 1;
                  
                  return (
                    <Card key={stop.id} className="animate-fade-in">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-ocean text-white font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="font-display text-xl">
                              {stop.city?.name}
                            </CardTitle>
                            <CardDescription>
                              {stop.city?.country} · {daysInCity} day{daysInCity !== 1 ? 's' : ''} · {format(new Date(stop.arrival_date), 'MMM d')} - {format(new Date(stop.departure_date), 'MMM d')}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      {stopActivities.length > 0 && (
                        <CardContent>
                          <div className="space-y-2">
                            {stopActivities.map((activity) => (
                              <div 
                                key={activity.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                              >
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="capitalize">
                                    {activity.activity?.category}
                                  </Badge>
                                  <span className="font-medium">{activity.activity?.name}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {stop.city?.country === 'India' 
                                    ? `₹${Number(activity.custom_cost || activity.activity?.estimated_cost || 0).toLocaleString()}`
                                    : `$${Number(activity.custom_cost || activity.activity?.estimated_cost || 0).toLocaleString()}`
                                  }
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <GlobeMap
                  markers={markers}
                  routes={routes}
                  mapboxToken={profile?.mapbox_token || undefined}
                  onTokenSubmit={handleTokenSubmit}
                  className="h-[500px]"
                  interactive={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Budget Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Budget Overview</CardTitle>
                  <CardDescription>
                    Track your spending across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Budget</span>
                      <span className="text-2xl font-bold">${Number(trip.total_budget).toLocaleString()}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Spent</span>
                        <span>${totalSpent.toLocaleString()} / ${totalPlanned.toLocaleString()}</span>
                      </div>
                      <Progress value={totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0} />
                    </div>
                  </div>

                  {pieData.length > 0 && (
                    <div className="h-[200px] mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Category Breakdown</CardTitle>
                  <CardDescription>
                    Planned vs actual spending
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {barData.length > 0 && (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} layout="vertical">
                          <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                          <YAxis type="category" dataKey="name" width={100} />
                          <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                          <Legend />
                          <Bar dataKey="planned" fill="#2563eb" name="Planned" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="spent" fill="#f97316" name="Spent" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
