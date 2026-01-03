import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  DollarSign, 
  Star, 
  MapPin,
  Loader2,
  Plus,
  Check
} from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  description: string | null;
  category: string;
  estimated_cost: number;
  duration_hours: number;
  rating: number;
  image_url: string | null;
}

interface City {
  id: string;
  name: string;
  country: string;
}

interface ActivityPopupProps {
  isOpen: boolean;
  onClose: () => void;
  city: City | null;
  tripStopId?: string; // For trip editing mode
  selectedActivityIds?: string[]; // Already selected activities
  onActivitiesSelected?: (activityIds: string[]) => void; // Callback for selection
  mode?: 'explore' | 'trip-edit'; // Different modes
}

export function ActivityPopup({
  isOpen,
  onClose,
  city,
  tripStopId,
  selectedActivityIds = [],
  onActivitiesSelected,
  mode = 'explore'
}: ActivityPopupProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedActivityIds);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (isOpen && city) {
      fetchActivities();
    }
  }, [isOpen, city]);

  useEffect(() => {
    setSelectedIds(selectedActivityIds);
  }, [selectedActivityIds]);

  const fetchActivities = async () => {
    if (!city) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('city_id', city.id)
        .order('rating', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load activities.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivityToggle = (activityId: string) => {
    setSelectedIds(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleAddToTrip = async () => {
    if (!tripStopId || selectedIds.length === 0) return;
    
    setAdding(true);
    try {
      // Add selected activities to the trip stop
      const tripActivities = selectedIds.map(activityId => ({
        trip_stop_id: tripStopId,
        activity_id: activityId,
      }));

      const { error } = await supabase
        .from('trip_activities')
        .insert(tripActivities);

      if (error) throw error;

      toast({
        title: 'Activities Added',
        description: `${selectedIds.length} activity${selectedIds.length !== 1 ? 'ies' : ''} added to your trip.`,
      });

      // Notify parent component
      onActivitiesSelected?.(selectedIds);
      onClose();
    } catch (error) {
      console.error('Error adding activities:', error);
      toast({
        title: 'Error',
        description: 'Failed to add activities to trip.',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      sightseeing: 'bg-blue-100 text-blue-800',
      food: 'bg-orange-100 text-orange-800',
      adventure: 'bg-red-100 text-red-800',
      culture: 'bg-purple-100 text-purple-800',
      nature: 'bg-green-100 text-green-800',
      shopping: 'bg-pink-100 text-pink-800',
      nightlife: 'bg-indigo-100 text-indigo-800',
      relaxation: 'bg-teal-100 text-teal-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (!city) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Activities in {city.name}, {city.country}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activities found for this destination.
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const isSelected = selectedIds.includes(activity.id);
                const isAlreadySelected = selectedActivityIds.includes(activity.id);
                
                return (
                  <div
                    key={activity.id}
                    className={`border rounded-lg p-4 transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {mode === 'trip-edit' && (
                        <div className="flex items-center pt-1">
                          {isAlreadySelected ? (
                            <div className="flex items-center justify-center w-5 h-5 rounded bg-green-100">
                              <Check className="h-3 w-3 text-green-600" />
                            </div>
                          ) : (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleActivityToggle(activity.id)}
                            />
                          )}
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{activity.name}</h3>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {activity.description}
                              </p>
                            )}
                          </div>
                          {activity.image_url && (
                            <img
                              src={activity.image_url}
                              alt={activity.name}
                              className="w-16 h-16 rounded-lg object-cover ml-4"
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <Badge className={getCategoryColor(activity.category)}>
                            {activity.category}
                          </Badge>
                          
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            {city?.country === 'India' ? `₹${activity.estimated_cost}` : `$${activity.estimated_cost}`}
                          </div>
                          
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {activity.duration_hours}h
                          </div>
                          
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            {activity.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {mode === 'trip-edit' && activities.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedIds.length} activity{selectedIds.length !== 1 ? 'ies' : ''} selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddToTrip}
                  disabled={selectedIds.length === 0 || adding}
                >
                  {adding ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add to Trip
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}