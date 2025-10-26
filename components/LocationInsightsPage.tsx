import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { AIFloatingButton } from './AIFloatingButton';
import { 
  MapPin, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Droplets,
  Wind,
  Shield,
  Activity,
  CheckCircle2,
  Info,
  Sparkles,
  Navigation as NavigationIcon,
  Quote
} from 'lucide-react';

interface LocationInsightsPageProps {
  onNavigate: (page: string) => void;
}

interface LocationData {
  location: string;
  region: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  plasticAccumulation: string;
  population: string;
  healthIssues: {
    disease: string;
    cases: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    severity: 'high' | 'medium' | 'low';
  }[];
  preventiveTips: {
    category: string;
    icon: any;
    tips: string[];
  }[];
  localHubs: number;
  activeCollectors: number;
  recentCollection: string;
  // New fields for statistics
  diseaseReductionRate: number;
  communityEngagementRate: number;
}

const mockLocationData: { [key: string]: LocationData } = {
  'accra': {
    location: 'Accra Metropolitan',
    region: 'Greater Accra',
    riskLevel: 'High',
    plasticAccumulation: '850 tons/month',
    population: '2.3M',
    diseaseReductionRate: 68,
    communityEngagementRate: 82,
    healthIssues: [
      { disease: 'Malaria', cases: 1247, trend: 'decreasing', severity: 'high' },
      { disease: 'Dengue Fever', cases: 83, trend: 'stable', severity: 'medium' },
      { disease: 'Respiratory Infections', cases: 2156, trend: 'increasing', severity: 'high' },
      { disease: 'Cholera', cases: 12, trend: 'decreasing', severity: 'low' },
    ],
    preventiveTips: [
      {
        category: 'Vector-Borne Disease Prevention',
        icon: Droplets,
        tips: [
          'Remove stagnant water from containers and plastic waste around your home',
          'Use mosquito nets, especially for children and elderly',
          'Clear gutters and drains blocked by plastic debris',
          'Participate in community clean-up days every 2nd Saturday',
        ],
      },
      {
        category: 'Respiratory Health',
        icon: Wind,
        tips: [
          'Avoid burning plastic waste - it releases toxic fumes',
          'Report open plastic burning to authorities via USSD *800*726563#',
          'Keep windows closed during high pollution hours (6-9 AM)',
          'Children and elderly should limit outdoor activities on high-risk days',
        ],
      },
      {
        category: 'General Health Protection',
        icon: Shield,
        tips: [
          'Ensure your NHIS is active - collect plastic to fund enrollment',
          'Wash hands regularly, especially before eating',
          'Drink only treated or boiled water',
          'Seek medical attention early for fever or persistent cough',
        ],
      },
    ],
    localHubs: 18,
    activeCollectors: 2847,
    recentCollection: '124 tons this week',
  },
  'kumasi': {
    location: 'Kumasi Central',
    region: 'Ashanti',
    riskLevel: 'High',
    plasticAccumulation: '620 tons/month',
    population: '1.8M',
    diseaseReductionRate: 71,
    communityEngagementRate: 79,
    healthIssues: [
      { disease: 'Malaria', cases: 892, trend: 'stable', severity: 'high' },
      { disease: 'Typhoid', cases: 156, trend: 'increasing', severity: 'medium' },
      { disease: 'Respiratory Infections', cases: 1678, trend: 'stable', severity: 'medium' },
    ],
    preventiveTips: [
      {
        category: 'Vector-Borne Disease Prevention',
        icon: Droplets,
        tips: [
          'Clear plastic bottles and containers that collect rainwater',
          'Use insect repellent when going out at dawn or dusk',
          'Install screens on windows and doors',
          'Join Sankofa collection efforts - earn while protecting your area',
        ],
      },
      {
        category: 'Food & Water Safety',
        icon: Shield,
        tips: [
          'Keep food covered and away from areas with plastic waste',
          'Wash fruits and vegetables thoroughly',
          'Ensure proper waste disposal - plastic attracts disease vectors',
          'Support local Hub Managers in maintaining clean collection points',
        ],
      },
    ],
    localHubs: 14,
    activeCollectors: 1923,
    recentCollection: '89 tons this week',
  },
  'tema': {
    location: 'Tema District',
    region: 'Greater Accra',
    riskLevel: 'Medium',
    plasticAccumulation: '380 tons/month',
    population: '850K',
    diseaseReductionRate: 75,
    communityEngagementRate: 85,
    healthIssues: [
      { disease: 'Malaria', cases: 423, trend: 'decreasing', severity: 'medium' },
      { disease: 'Skin Infections', cases: 267, trend: 'stable', severity: 'low' },
      { disease: 'Respiratory Infections', cases: 891, trend: 'decreasing', severity: 'medium' },
    ],
    preventiveTips: [
      {
        category: 'Community Cleanliness',
        icon: Activity,
        tips: [
          'Continue current collection efforts - you\'re making a difference!',
          'Report illegal dumping sites to your Hub Manager',
          'Organize neighborhood clean-up events monthly',
          'Educate neighbors about proper plastic disposal',
        ],
      },
      {
        category: 'Personal Health',
        icon: Shield,
        tips: [
          'Maintain good hygiene practices',
          'Keep your NHIS active through Sankofa Health Tokens',
          'Regular health check-ups at local clinics',
          'Stay informed about health alerts in your area',
        ],
      },
    ],
    localHubs: 9,
    activeCollectors: 1156,
    recentCollection: '52 tons this week',
  },
};

const testimonials = [
  {
    quote: "Through Sankofa's health insights, our community identified malaria hotspots linked to plastic waste. We organized targeted clean-ups and saw a 40% reduction in cases within 3 months.",
    author: "Ama Darko",
    role: "Hub Manager, Accra",
    avatar: "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
  },
  {
    quote: "The AI health data helped us understand why respiratory problems were increasing in our neighborhood. Now we know to avoid burning plastic and report illegal dumping.",
    author: "Kwame Mensah",
    role: "Collector, Kumasi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
  }
];

export function LocationInsightsPage({ onNavigate }: LocationInsightsPageProps) {
  const [location, setLocation] = useState('');
  const [searchedLocation, setSearchedLocation] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const normalizedLocation = location.toLowerCase().trim();
      const data = mockLocationData[normalizedLocation] || mockLocationData['accra'];
      setLocationData(data);
      setSearchedLocation(location);
      setIsSearching(false);
    }, 1500);
  };

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Simple mapping of coordinates to major Ghanaian cities
        const getNearestCity = (lat: number, lon: number) => {
          const cities = [
            { name: 'Accra', lat: 5.6037, lon: -0.1870 },
            { name: 'Kumasi', lat: 6.6885, lon: -1.6244 },
            { name: 'Tema', lat: 5.6698, lon: -0.0166 },
          ];

          let nearestCity = cities[0];
          let minDistance = Number.MAX_VALUE;

          cities.forEach(city => {
            const distance = Math.sqrt(
              Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestCity = city;
            }
          });

          return nearestCity.name;
        };

        const nearestCity = getNearestCity(latitude, longitude);
        setLocation(nearestCity);
        setIsGettingLocation(false);
        
        // Automatically trigger search
        setTimeout(() => {
          const normalizedLocation = nearestCity.toLowerCase().trim();
          const data = mockLocationData[normalizedLocation] || mockLocationData['accra'];
          setLocationData(data);
          setSearchedLocation(nearestCity);
        }, 500);
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = 'Unable to retrieve your location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location permissions and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        
        alert(errorMessage + '\n\nPlease enter your location manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="w-full">
      <AIFloatingButton onNavigate={onNavigate} />
      
      {/* Hero Section - Dark Theme */}
      <section className="bg-black text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div
            >
              <p className="text-white/60 mb-4 uppercase tracking-wider">Community</p>
              <h1 className="mb-8 text-white">Health Intelligence</h1>
            </div>

            {/* Hero Image with Overlaid Text */}
            <div
              className="relative rounded-2xl overflow-hidden mb-12"
            >
              <div className="aspect-video relative">
                <img
                  src="https://images.unsplash.com/photo-1584365132623-e273491c69d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
                  alt="Community health workers collaborating"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* User Feedback Overlays */}
                <div className="absolute top-8 left-8 max-w-xs">
                  <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-lg p-4">
                    <p className="text-sm text-white/90">
                      "I need personalized advice on reducing my credit score progress."
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 max-w-xs">
                  <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-lg p-4">
                    <p className="text-sm text-white/90">
                      "I want instant access to my health updates."
                    </p>
                  </div>
                </div>

                <div className="absolute top-1/2 right-8 -translate-y-1/2 max-w-xs hidden md:block">
                  <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-lg p-4">
                    <p className="text-sm text-white/90">
                      "I need a simple way to track my credit score progress."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {/* Statistic 1 */}
              <div
              >
                <div className="h-1 w-32 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full mb-6" />
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-8xl md:text-9xl tracking-tight">73</span>
                  <span className="text-5xl">%</span>
                </div>
                <p className="text-white/70 max-w-sm">
                  Communities struggle to track disease patterns and experience a lack of health data integration
                </p>
              </div>

              {/* Statistic 2 */}
              <div
              >
                <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full mb-6" />
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-8xl md:text-9xl tracking-tight">62</span>
                  <span className="text-5xl">%</span>
                </div>
                <p className="text-white/70 max-w-sm">
                  Communities struggle to improve health outcomes without personalized advice
                </p>
              </div>
            </div>

            {/* Testimonial */}
            <div
              className="border-l-4 border-emerald-500 pl-8 py-4"
            >
              <Quote className="h-8 w-8 text-emerald-500 mb-4" />
              <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed">
                Through AI-powered insights, we've gained valuable health intelligence that has led to a 40% improvement in disease prevention, enhancing community health and increasing access to healthcare.
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
                  alt="Ama Darko"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-white">Ama Darko</p>
                  <p className="text-white/60 text-sm">Hub Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section - Light Background */}
      <section className="py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="mb-4 text-white font-bold text-[24px]">Get AI Insights for Your Area</h2>
              <p className="text-lg text-white/70">
                Enter your location to discover health risks and preventive recommendations
              </p>
            </div>

            <Card className="p-8 bg-white/5 backdrop-blur border border-white/10 shadow-xl bg-[rgba(255,255,255,0.13)]">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location" className="sr-only">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="e.g., Accra, Kumasi, Tema, Cape Coast..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 text-lg py-6 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={!location.trim() || isSearching}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2 py-6"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <Activity className="h-5 w-5 animate-spin" />
                      Analyzing Health Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Get AI Health Insights
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-white/60">Or</span>
                  </div>
                </div>

                <Button
                  onClick={handleGetMyLocation}
                  disabled={isGettingLocation || isSearching}
                  variant="outline"
                  className="w-full border-2 border-white/30 text-[rgb(23,5,5)] hover:bg-white/10 gap-2 py-6 bg-[rgb(255,255,255)]"
                  size="lg"
                >
                  {isGettingLocation ? (
                    <>
                      <Activity className="h-5 w-5 animate-spin" />
                      Getting Your Location...
                    </>
                  ) : (
                    <>
                      <NavigationIcon className="h-5 w-5" />
                      Use My Current Location
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-center text-white/60">
                  <strong className="text-white/80">Try:</strong> Accra, Kumasi, Tema, Cape Coast, Takoradi
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {locationData && (
        <>
          {/* Dark Statistics Section */}
          <section className="py-16 md:py-20 bg-black text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-white mb-4">Impact in {locationData.location}</h2>
                  <p className="text-white/70 text-lg">{locationData.region} Region</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                  {/* Disease Reduction */}
                  <div
                  >
                    <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6" />
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-8xl md:text-9xl tracking-tight">{locationData.diseaseReductionRate}</span>
                      <span className="text-5xl">%</span>
                    </div>
                    <p className="text-white/70 text-lg max-w-sm">
                      Disease reduction in areas with active plastic collection and health monitoring
                    </p>
                  </div>

                  {/* Community Engagement */}
                  <div
                  >
                    <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6" />
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-8xl md:text-9xl tracking-tight">{locationData.communityEngagementRate}</span>
                      <span className="text-5xl">%</span>
                    </div>
                    <p className="text-white/70 text-lg max-w-sm">
                      Community members actively participate in health improvement initiatives
                    </p>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-red-400" />
                      <h3 className="text-white/90">Plastic Load</h3>
                    </div>
                    <div className="text-3xl text-red-400 mb-1">{locationData.plasticAccumulation}</div>
                    <p className="text-sm text-white/60">Monthly average</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <h3 className="text-white/90">Active Hubs</h3>
                    </div>
                    <div className="text-3xl text-blue-400 mb-1">{locationData.localHubs}</div>
                    <p className="text-sm text-white/60">Collection points</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-emerald-400" />
                      <h3 className="text-white/90">Collectors</h3>
                    </div>
                    <div className="text-3xl text-emerald-400 mb-1">{locationData.activeCollectors}</div>
                    <p className="text-sm text-white/60">Active in area</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-yellow-400" />
                      <h3 className="text-white/90">This Week</h3>
                    </div>
                    <div className="text-xl text-yellow-400 mb-1">{locationData.recentCollection}</div>
                    <p className="text-sm text-white/60">Collected</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Health Issues Section - Light */}
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <Alert className="mb-8 bg-blue-50 border-blue-200">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>AI Analysis Complete:</strong> Based on {locationData.recentCollection} of plastic collected, 
                    environmental data, and health records from {locationData.population} population. 
                    Last updated: October 25, 2025
                  </AlertDescription>
                </Alert>

                <Card className="p-8 mb-12 border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-gray-900">Disease Patterns</h2>
                    <Badge className={`px-4 py-2 border-2 ${getRiskColor(locationData.riskLevel)}`}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {locationData.riskLevel} Risk
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-6">
                    AI-detected health trends based on local medical records and environmental risk factors
                  </p>

                  <div className="space-y-4">
                    {locationData.healthIssues.map((issue, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            issue.severity === 'high' ? 'bg-red-100' :
                            issue.severity === 'medium' ? 'bg-yellow-100' :
                            'bg-green-100'
                          }`}>
                            <Activity className={`h-6 w-6 ${
                              issue.severity === 'high' ? 'text-red-600' :
                              issue.severity === 'medium' ? 'text-yellow-600' :
                              'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-gray-900 mb-1">{issue.disease}</h3>
                            <p className="text-sm text-gray-600">
                              {issue.cases.toLocaleString()} reported cases this month
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(issue.trend)}
                          <span className={`text-sm capitalize ${
                            issue.trend === 'increasing' ? 'text-red-600' :
                            issue.trend === 'decreasing' ? 'text-green-600' :
                            'text-yellow-600'
                          }`}>
                            {issue.trend}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900">
                      <strong>Note:</strong> These figures are based on aggregated health records from local clinics and hospitals. 
                      For medical emergencies, call 112 or visit your nearest health facility.
                    </p>
                  </div>
                </Card>

                {/* Preventive Tips */}
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="mb-2 text-gray-900">AI-Recommended Actions</h2>
                    <p className="text-gray-600">
                      Personalized health protection tips for {locationData.location}
                    </p>
                  </div>

                  {locationData.preventiveTips.map((category, index) => (
                    <Card key={index} className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
                          <category.icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-gray-900 mb-2">{category.category}</h3>
                          <p className="text-sm text-gray-600">
                            Evidence-based recommendations for disease prevention
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-3">
                        {category.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>

                {/* Testimonial Section */}
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <Card key={index} className="p-8 border-2 border-gray-200">
                      <Quote className="h-8 w-8 text-emerald-500 mb-4" />
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {testimonial.quote}
                      </p>
                      <div className="flex items-center gap-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-gray-900">{testimonial.author}</p>
                          <p className="text-gray-600 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* CTA */}
                <Card className="mt-12 p-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
                  <div className="text-center">
                    <h3 className="text-white mb-4">Join the Health Revolution</h3>
                    <p className="text-emerald-50 mb-6 max-w-2xl mx-auto">
                      Become a Collector and contribute to real-time health monitoring while earning income and accessing healthcare
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => onNavigate('collector')}
                        size="lg"
                        className="bg-white text-emerald-700 hover:bg-emerald-50"
                      >
                        Start Collecting Today
                      </Button>
                      <Button
                        onClick={() => onNavigate('ai-assistant')}
                        size="lg"
                        variant="outline"
                        className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Ask Sankofa AI
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Educational Section */}
      <section className="py-16 md:py-20 bg-[#FBBF24]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-gray-900">How AI Health Intelligence Works</h2>
              <p className="text-lg text-gray-800">
                Transforming data into life-saving insights for your community
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card className="p-6 text-center bg-white border-none shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-4 mx-auto">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-gray-900">Data Collection</h3>
                <p className="text-sm text-gray-700">
                  We gather plastic collection data, GPS locations, environmental factors, and anonymized health records
                </p>
              </Card>

              <Card className="p-6 text-center bg-white border-none shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mb-4 mx-auto">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-gray-900">AI Analysis</h3>
                <p className="text-sm text-gray-700">
                  Machine learning identifies patterns between plastic accumulation and disease outbreaks
                </p>
              </Card>

              <Card className="p-6 text-center bg-white border-none shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 mb-4 mx-auto">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-gray-900">Actionable Insights</h3>
                <p className="text-sm text-gray-700">
                  You receive personalized health tips and early warnings to protect your family
                </p>
              </Card>
            </div>

            <Card className="p-6 bg-white border-none shadow-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-gray-900 mb-2">Privacy & Data Protection</h4>
                  <p className="text-sm text-gray-700">
                    All health data is anonymized and aggregated. We never share individual information. 
                    Our AI models use privacy-preserving techniques to protect your identity while providing 
                    valuable community health insights. Learn more in our{' '}
                    <button onClick={() => onNavigate('contact')} className="text-amber-700 hover:underline">
                      privacy policy
                    </button>.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
