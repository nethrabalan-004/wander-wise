import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  Plane,
  Camera,
  Heart,
  Trophy,
  Globe,
  Calendar,
  TrendingUp,
  Award,
  Sparkles,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TravelStats {
  totalTrips: number;
  totalDestinations: number;
  totalDays: number;
  totalBudget: number;
  favoriteDestination: string;
  favoriteActivity: string;
  longestTrip: number;
  averageTripLength: number;
  mostExpensiveTrip: number;
  totalActivities: number;
  countriesVisited: string[];
  monthlyBreakdown: { [key: string]: number };
}

const TravelWrap = () => {
  const { user } = useAuth();
  const [currentCard, setCurrentCard] = useState(0);
  const [stats, setStats] = useState<TravelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock data for demonstration
  const mockStats: TravelStats = {
    totalTrips: 12,
    totalDestinations: 28,
    totalDays: 156,
    totalBudget: 45000,
    favoriteDestination: 'Goa, India',
    favoriteActivity: 'Beach Activities',
    longestTrip: 21,
    averageTripLength: 8.5,
    mostExpensiveTrip: 12000,
    totalActivities: 89,
    countriesVisited: ['India', 'Thailand', 'Japan', 'France', 'Italy', 'Spain'],
    monthlyBreakdown: {
      'Jan': 2, 'Feb': 1, 'Mar': 3, 'Apr': 2, 'May': 1, 'Jun': 0,
      'Jul': 1, 'Aug': 2, 'Sep': 0, 'Oct': 1, 'Nov': 2, 'Dec': 1
    }
  };

  useEffect(() => {
    fetchTravelStats();
  }, [user]);

  const fetchTravelStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Use mock data for now - in real app would fetch from Supabase
      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching travel stats:', error);
      setStats(mockStats);
      setLoading(false);
    }
  };

  const startWrap = () => {
    setIsPlaying(true);
    setCurrentCard(0);
  };

  const nextCard = () => {
    if (currentCard < wrapCards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const shareWrap = () => {
    // Mock share functionality
    navigator.clipboard.writeText('Check out my 2024 Travel Wrap on WanderWise! 🌍✈️');
    alert('Travel Wrap link copied to clipboard!');
  };

  if (!stats) return null;

  const wrapCards = [
    // Welcome Card
    {
      id: 'welcome',
      title: '2024 Travel Wrap',
      subtitle: 'Your year in wanderlust',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative mx-auto w-32 h-32"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Globe className="w-16 h-16 text-blue-500 animate-spin-slow" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to explore your journey?
            </h2>
            <p className="text-gray-600 mt-2">Let's see how far you've wandered this year!</p>
          </motion.div>
        </div>
      ),
      background: 'bg-gradient-to-br from-blue-50 to-purple-50'
    },

    // Total Trips Card
    {
      id: 'trips',
      title: 'Adventures Taken',
      subtitle: 'Your wanderlust in numbers',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
            className="relative"
          >
            <div className="text-8xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {stats.totalTrips}
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4"
            >
              <Plane className="w-12 h-12 text-orange-500" />
            </motion.div>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Epic Trips</h3>
            <p className="text-gray-600">You're officially a travel addict! 🎒</p>
          </div>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">{stats.totalDestinations}</div>
              <div className="text-gray-500">Destinations</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.totalDays}</div>
              <div className="text-gray-500">Days Traveled</div>
            </div>
          </div>
        </div>
      ),
      background: 'bg-gradient-to-br from-orange-50 to-red-50'
    },

    // Favorite Destination Card
    {
      id: 'favorite',
      title: 'Your Happy Place',
      subtitle: 'The destination that stole your heart',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-48 h-32 rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop" 
              alt="Goa Beach"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-2 right-2"
            >
              <Heart className="w-6 h-6 text-red-500 fill-current" />
            </motion.div>
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{stats.favoriteDestination}</h3>
            <p className="text-gray-600">You visited this paradise 3 times! 🏖️</p>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center space-x-2"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </motion.div>
        </div>
      ),
      background: 'bg-gradient-to-br from-green-50 to-blue-50'
    },

    // Budget Spent Card
    {
      id: 'budget',
      title: 'Investment in Memories',
      subtitle: 'Money well spent on experiences',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative"
          >
            <div className="text-6xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              ₹{stats.totalBudget.toLocaleString()}
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-8"
            >
              <DollarSign className="w-10 h-10 text-green-500" />
            </motion.div>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Total Invested</h3>
            <p className="text-gray-600">Every rupee created a memory! 💰</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-bold text-lg">₹{stats.mostExpensiveTrip.toLocaleString()}</div>
              <div className="text-gray-500">Most Expensive Trip</div>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-bold text-lg">₹{Math.round(stats.totalBudget / stats.totalTrips).toLocaleString()}</div>
              <div className="text-gray-500">Average per Trip</div>
            </div>
          </div>
        </div>
      ),
      background: 'bg-gradient-to-br from-green-50 to-emerald-50'
    },

    // Activities Card
    {
      id: 'activities',
      title: 'Adventure Seeker',
      subtitle: 'Your favorite way to explore',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-40 h-40 rounded-full overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop" 
              alt="Beach Activities"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent"></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-purple-500 border-dashed rounded-full"
            ></motion.div>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.favoriteActivity}</h3>
            <p className="text-gray-600">Your go-to adventure style! 🏄‍♀️</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">{stats.totalActivities}</div>
            <div className="text-gray-500">Total Activities Experienced</div>
          </div>
        </div>
      ),
      background: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },

    // Countries Visited Card
    {
      id: 'countries',
      title: 'Global Explorer',
      subtitle: 'Countries you conquered',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative"
          >
            <div className="text-7xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {stats.countriesVisited.length}
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4"
            >
              <Globe className="w-12 h-12 text-indigo-500" />
            </motion.div>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Countries Explored</h3>
            <p className="text-gray-600">You're becoming a true global citizen! 🌍</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {stats.countriesVisited.map((country, index) => (
              <motion.div
                key={country}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge variant="outline" className="bg-white/50 text-indigo-700 border-indigo-200">
                  {country}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      ),
      background: 'bg-gradient-to-br from-indigo-50 to-purple-50'
    },

    // Travel Personality Card
    {
      id: 'personality',
      title: 'Your Travel Personality',
      subtitle: 'Based on your journey patterns',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative mx-auto w-32 h-32"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              The Beach Wanderer
            </h3>
            <p className="text-gray-600 mt-2">You love coastal destinations and water activities! 🏖️</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-bold text-lg">{stats.longestTrip} days</div>
              <div className="text-gray-500">Longest Adventure</div>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-bold text-lg">{stats.averageTripLength} days</div>
              <div className="text-gray-500">Average Trip Length</div>
            </div>
          </div>
        </div>
      ),
      background: 'bg-gradient-to-br from-yellow-50 to-orange-50'
    },

    // Share Card
    {
      id: 'share',
      title: 'Share Your Journey',
      subtitle: 'Let the world see your wanderlust',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative mx-auto w-32 h-32"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Share2 className="w-16 h-16 text-pink-500" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Amazing Year!</h3>
            <p className="text-gray-600">Share your 2024 Travel Wrap with friends! 📱</p>
          </div>
          <Button 
            onClick={shareWrap}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
          >
            Share My Travel Wrap ✨
          </Button>
        </div>
      ),
      background: 'bg-gradient-to-br from-pink-50 to-rose-50'
    }
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="h-12 w-12 text-primary" />
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  if (!isPlaying) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 max-w-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative mx-auto w-40 h-40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <Globe className="w-20 h-20 text-blue-500" />
              </div>
            </motion.div>
            
            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                2024 Travel Wrap
              </h1>
              <p className="text-xl text-gray-600">
                Discover your year of wanderlust in a whole new way
              </p>
              <p className="text-gray-500">
                Just like Spotify Wrapped, but for your adventures! 🌍✈️
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={startWrap}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl"
              >
                Start My Travel Wrap ✨
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard}
              initial={{ opacity: 0, x: 300, rotateY: 90 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -300, rotateY: -90 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <Card className={`${wrapCards[currentCard].background} border-0 shadow-2xl overflow-hidden`}>
                <CardContent className="p-8 min-h-[600px] flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {wrapCards[currentCard].title}
                    </h2>
                    <p className="text-gray-600">
                      {wrapCards[currentCard].subtitle}
                    </p>
                  </motion.div>

                  {wrapCards[currentCard].content}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={prevCard}
              disabled={currentCard === 0}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {wrapCards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentCard ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextCard}
              disabled={currentCard === wrapCards.length - 1}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TravelWrap;