-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  mapbox_token TEXT,
  preferred_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create cities table with sample destination data
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  cost_index INTEGER DEFAULT 50 CHECK (cost_index >= 1 AND cost_index <= 100),
  popularity_rating DECIMAL(3, 2) DEFAULT 3.00 CHECK (popularity_rating >= 0 AND popularity_rating <= 5),
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create activity categories enum
CREATE TYPE public.activity_category AS ENUM ('sightseeing', 'food', 'adventure', 'culture', 'nature', 'shopping', 'nightlife', 'relaxation');

-- Create activities table with sample activities
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category activity_category NOT NULL,
  estimated_cost DECIMAL(10, 2) DEFAULT 0,
  duration_hours DECIMAL(4, 2) DEFAULT 1,
  image_url TEXT,
  rating DECIMAL(3, 2) DEFAULT 4.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trips table for user trips
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  total_budget DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trip_stops table for cities within a trip
CREATE TABLE public.trip_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE RESTRICT NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  order_index INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trip_activities table for activities assigned to stops
CREATE TABLE public.trip_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_stop_id UUID REFERENCES public.trip_stops(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES public.activities(id) ON DELETE RESTRICT NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  custom_cost DECIMAL(10, 2),
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create budget categories enum
CREATE TYPE public.budget_category AS ENUM ('transport', 'accommodation', 'activities', 'food', 'shopping', 'other');

-- Create trip_budgets table for budget tracking
CREATE TABLE public.trip_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  category budget_category NOT NULL,
  planned_amount DECIMAL(12, 2) DEFAULT 0,
  spent_amount DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(trip_id, category)
);

-- Create favorite_destinations table
CREATE TABLE public.favorite_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, city_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_destinations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cities policies (public read for everyone)
CREATE POLICY "Anyone can view cities" ON public.cities
  FOR SELECT USING (true);

-- Activities policies (public read for everyone)
CREATE POLICY "Anyone can view activities" ON public.activities
  FOR SELECT USING (true);

-- Trips policies
CREATE POLICY "Users can view their own trips" ON public.trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public trips" ON public.trips
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create their own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- Trip stops policies (linked to trip ownership)
CREATE POLICY "Users can view their trip stops" ON public.trip_stops
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid())
  );

CREATE POLICY "Users can view public trip stops" ON public.trip_stops
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_stops.trip_id AND trips.is_public = true)
  );

CREATE POLICY "Users can manage their trip stops" ON public.trip_stops
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid())
  );

-- Trip activities policies (linked to trip ownership via stop)
CREATE POLICY "Users can view their trip activities" ON public.trip_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops ts
      JOIN public.trips t ON ts.trip_id = t.id
      WHERE ts.id = trip_activities.trip_stop_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view public trip activities" ON public.trip_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops ts
      JOIN public.trips t ON ts.trip_id = t.id
      WHERE ts.id = trip_activities.trip_stop_id AND t.is_public = true
    )
  );

CREATE POLICY "Users can manage their trip activities" ON public.trip_activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops ts
      JOIN public.trips t ON ts.trip_id = t.id
      WHERE ts.id = trip_activities.trip_stop_id AND t.user_id = auth.uid()
    )
  );

-- Trip budgets policies (linked to trip ownership)
CREATE POLICY "Users can view their trip budgets" ON public.trip_budgets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_budgets.trip_id AND trips.user_id = auth.uid())
  );

CREATE POLICY "Users can view public trip budgets" ON public.trip_budgets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_budgets.trip_id AND trips.is_public = true)
  );

CREATE POLICY "Users can manage their trip budgets" ON public.trip_budgets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_budgets.trip_id AND trips.user_id = auth.uid())
  );

-- Favorite destinations policies
CREATE POLICY "Users can view their favorites" ON public.favorite_destinations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their favorites" ON public.favorite_destinations
  FOR ALL USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_budgets_updated_at
  BEFORE UPDATE ON public.trip_budgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_public ON public.trips(is_public) WHERE is_public = true;
CREATE INDEX idx_trip_stops_trip_id ON public.trip_stops(trip_id);
CREATE INDEX idx_trip_activities_stop_id ON public.trip_activities(trip_stop_id);
CREATE INDEX idx_activities_city_id ON public.activities(city_id);
CREATE INDEX idx_cities_country ON public.cities(country);
CREATE INDEX idx_favorite_destinations_user_id ON public.favorite_destinations(user_id);