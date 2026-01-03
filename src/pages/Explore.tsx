import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Star,
  Loader2,
  Filter,
  Clock,
  Heart
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface City {
  id: string;
  name: string;
  country: string;
  region: string | null;
  latitude: number;
  longitude: number;
  cost_index: number;
  popularity_rating: number;
  image_url: string | null;
  description: string | null;
}

interface Activity {
  id: string;
  city_id: string;
  name: string;
  description: string | null;
  category: string;
  estimated_cost: number;
  duration_hours: number;
  rating: number;
  city?: City;
}

const ACTIVITY_CATEGORIES = [
  'sightseeing', 'food', 'adventure', 'culture', 'nature', 'shopping', 'nightlife', 'relaxation'
];

const REGIONS = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East', 'Caribbean'];

export default function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [citySearch, setCitySearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string | null>(searchParams.get('city'));

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch cities
    const { data: citiesData } = await supabase
      .from('cities')
      .select('*')
      .order('popularity_rating', { ascending: false });
    setCities(citiesData || []);

    // Fetch activities with city data
    const { data: activitiesData } = await supabase
      .from('activities')
      .select(`*, cities (*)`)
      .order('rating', { ascending: false });
    
    const formattedActivities = (activitiesData || []).map(act => ({
      ...act,
      city: act.cities as unknown as City
    }));
    setActivities(formattedActivities);

    // Fetch user favorites
    if (user) {
      const { data: favData } = await supabase
        .from('favorite_destinations')
        .select('city_id')
        .eq('user_id', user.id);
      setFavorites((favData || []).map(f => f.city_id));
    }

    setLoading(false);
  };

  const toggleFavorite = async (cityId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save favorites.',
        variant: 'destructive',
      });
      return;
    }

    const isFavorite = favorites.includes(cityId);
    
    if (isFavorite) {
      await supabase
        .from('favorite_destinations')
        .delete()
        .eq('user_id', user.id)
        .eq('city_id', cityId);
      setFavorites(favorites.filter(f => f !== cityId));
    } else {
      await supabase
        .from('favorite_destinations')
        .insert({ user_id: user.id, city_id: cityId });
      setFavorites([...favorites, cityId]);
    }
  };

  const getCostLabel = (index: number) => {
    if (index <= 30) return { label: 'Budget', color: 'bg-green-100 text-green-700' };
    if (index <= 60) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Expensive', color: 'bg-red-100 text-red-700' };
  };

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      city.country.toLowerCase().includes(citySearch.toLowerCase());
    const matchesRegion = regionFilter === 'all' || city.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(activitySearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;
    const matchesCity = !selectedCity || activity.city_id === selectedCity;
    return matchesSearch && matchesCategory && matchesCity;
  });

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
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Explore</h1>
          <p className="text-muted-foreground mt-1">
            Discover amazing destinations and activities around the world
          </p>
        </div>

        <Tabs defaultValue="cities">
          <TabsList>
            <TabsTrigger value="cities" className="gap-2">
              <MapPin className="h-4 w-4" />
              Destinations
            </TabsTrigger>
            <TabsTrigger value="activities" className="gap-2">
              <Star className="h-4 w-4" />
              Activities
            </TabsTrigger>
          </TabsList>

          {/* Cities Tab */}
          <TabsContent value="cities" className="mt-6 space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cities or countries..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cities Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCities.map((city) => {
                const costInfo = getCostLabel(city.cost_index);
                const isFavorite = favorites.includes(city.id);
                
                return (
                  <Card 
                    key={city.id} 
                    className="overflow-hidden hover:shadow-soft transition-all group animate-fade-in"
                  >
                    <div 
                      className="h-40 bg-cover bg-center relative"
                      style={{ 
                        backgroundImage: city.image_url 
                          ? `url(${city.image_url})` 
                          : 'linear-gradient(135deg, hsl(217 91% 50%), hsl(199 89% 48%))'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-white/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(city.id);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                        />
                      </Button>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-display font-semibold text-lg text-white">
                          {city.name}
                        </h3>
                        <p className="text-white/80 text-sm">{city.country}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={costInfo.color}>
                          {costInfo.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{Number(city.popularity_rating).toFixed(1)}</span>
                        </div>
                      </div>
                      {city.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {city.description}
                        </p>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setSelectedCity(city.id);
                          const tabTrigger = document.querySelector('[data-state="inactive"][value="activities"]') as HTMLElement;
                          tabTrigger?.click();
                        }}
                      >
                        View Activities
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredCities.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No destinations found matching your criteria</p>
              </div>
            )}
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="mt-6 space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {ACTIVITY_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCity && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCity(null)}
                  className="gap-2"
                >
                  Clear City Filter
                </Button>
              )}
            </div>

            {/* Activities Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden hover:shadow-soft transition-all animate-fade-in">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="font-display text-lg">{activity.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {activity.city?.name}, {activity.city?.country}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {activity.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>${Number(activity.estimated_cost).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{activity.duration_hours}h</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{Number(activity.rating).toFixed(1)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No activities found matching your criteria</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
