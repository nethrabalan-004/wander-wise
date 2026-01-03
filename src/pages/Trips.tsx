import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Calendar, 
  MapPin,
  Loader2,
  Trash2,
  Edit,
  Eye,
  MoreVertical
} from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface Trip {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  cover_image_url: string | null;
  total_budget: number;
  is_public: boolean;
}

interface TripWithStops extends Trip {
  stop_count: number;
}

export default function Trips() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trips, setTrips] = useState<TripWithStops[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchTrips();
  }, [user]);

  const fetchTrips = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { data: tripsData, error } = await supabase
      .from('trips')
      .select(`
        *,
        trip_stops (count)
      `)
      .eq('user_id', user.id)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching trips:', error);
    } else {
      const tripsWithCounts = (tripsData || []).map(trip => ({
        ...trip,
        stop_count: trip.trip_stops?.[0]?.count || 0
      }));
      setTrips(tripsWithCounts);
    }
    
    setLoading(false);
  };

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripToDelete);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete trip. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Trip Deleted',
        description: 'Your trip has been deleted.',
      });
      setTrips(trips.filter(t => t.id !== tripToDelete));
    }

    setTripToDelete(null);
    setDeleteDialogOpen(false);
  };

  const upcomingTrips = trips.filter(t => isFuture(new Date(t.start_date)));
  const pastTrips = trips.filter(t => isPast(new Date(t.end_date)));
  const currentTrips = trips.filter(t => 
    !isFuture(new Date(t.start_date)) && !isPast(new Date(t.end_date))
  );

  const TripCard = ({ trip }: { trip: TripWithStops }) => (
    <Card className="overflow-hidden hover:shadow-soft transition-shadow animate-fade-in group">
      <div 
        className="h-32 bg-cover bg-center relative"
        style={{ 
          backgroundImage: trip.cover_image_url 
            ? `url(${trip.cover_image_url})` 
            : 'linear-gradient(135deg, hsl(217 91% 50%), hsl(199 89% 48%))'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/trips/${trip.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/trips/${trip.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => {
                  setTripToDelete(trip.id);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-semibold text-lg text-white truncate">
            {trip.name}
          </h3>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{trip.stop_count} stops</span>
          </div>
        </div>
        {trip.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {trip.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            ${Number(trip.total_budget || 0).toLocaleString()} budget
          </span>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            View Trip
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">{message}</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={() => navigate('/trips/new')}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create a Trip
      </Button>
    </div>
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
            <h1 className="font-display text-3xl font-bold text-foreground">My Trips</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all your travel plans
            </p>
          </div>
          <Button 
            onClick={() => navigate('/trips/new')} 
            className="gradient-ocean gap-2"
          >
            <Plus className="h-4 w-4" />
            New Trip
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({trips.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingTrips.length})</TabsTrigger>
            <TabsTrigger value="current">Current ({currentTrips.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastTrips.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {trips.length === 0 ? (
              <EmptyState message="You haven't planned any trips yet" />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingTrips.length === 0 ? (
              <EmptyState message="No upcoming trips planned" />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="current" className="mt-6">
            {currentTrips.length === 0 ? (
              <EmptyState message="No trips currently in progress" />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastTrips.length === 0 ? (
              <EmptyState message="No past trips to show" />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
              All stops, activities, and budget data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTrip}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
