import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Loader2, 
  Plane,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { z } from 'zod';

const tripSchema = z.object({
  name: z.string().min(2, 'Trip name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  budget: z.number().min(0).optional(),
});

export default function CreateTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [budget, setBudget] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const validatedData = tripSchema.parse({
        name,
        description: description || undefined,
        startDate,
        endDate,
        budget: budget ? parseFloat(budget) : undefined,
      });

      if (validatedData.endDate < validatedData.startDate) {
        toast({
          title: 'Invalid Dates',
          description: 'End date must be after start date.',
          variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          name: validatedData.name,
          description: validatedData.description || null,
          start_date: format(validatedData.startDate, 'yyyy-MM-dd'),
          end_date: format(validatedData.endDate, 'yyyy-MM-dd'),
          total_budget: validatedData.budget || 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Create default budget categories
      const budgetCategories = ['transport', 'accommodation', 'activities', 'food', 'shopping', 'other'];
      await supabase
        .from('trip_budgets')
        .insert(budgetCategories.map(category => ({
          trip_id: data.id,
          category: category as any,
          planned_amount: 0,
          spent_amount: 0,
        })));

      toast({
        title: 'Trip Created!',
        description: 'Now let\'s add some destinations to your trip.',
      });

      navigate(`/trips/${data.id}/edit`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        console.error('Error creating trip:', error);
        toast({
          title: 'Error',
          description: 'Failed to create trip. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Plan a New Trip</h1>
          <p className="text-muted-foreground mt-1">
            Let's start with the basics. You can add destinations and activities next.
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-ocean">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>Give your adventure a name and dates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trip Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Trip Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., European Summer Adventure"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What's this trip about? Any special occasions?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
              </div>

              {/* Dates */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => 
                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          (startDate ? date < startDate : false)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget">Total Budget (optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0.00"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="pl-10"
                    min={0}
                    step={0.01}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You can adjust this later and track spending by category
                </p>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/trips')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 gradient-ocean gap-2"
                  disabled={isLoading || !name || !startDate || !endDate}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create & Add Stops
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
