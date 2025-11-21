
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AIFloatingButton } from "./AIFloatingButton";
import { CustomerServiceChatbot } from "./CustomerServiceChatbot";
import { SeeAndReportPopup } from "./SeeAndReportPopup";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Recycle,
  Droplets,
  Wind,
  Shield,
  TrendingUp,
  MapPin,
  Sparkles,
  Heart,
  ArrowRight,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// Sankofa-Coin Logo path
const imgRectangle10 = '/logo.png';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

// Hub data
const hubs = [
  {
    id: 'market-circle',
    name: 'Market Circle',
    location: 'Western Region',
    collectors: null,
    comingSoon: true,
    position: { top: '30%', left: '25%' }
  },
  {
    id: 'tema-hub',
    name: 'Tema Hub',
    location: 'Community 1',
    region: 'Greater Accra Region',
    collectors: 112,
    comingSoon: false,
    position: { bottom: '28%', right: '22%' }
  },
  {
    id: 'accra-central',
    name: 'Accra Central Hub',
    location: 'Makola Market',
    region: 'Greater Accra Region',
    collectors: 234,
    comingSoon: false,
    position: { bottom: '30%', right: '20%' }
  },
  {
    id: 'kumasi-hub',
    name: 'Kumasi Hub',
    location: 'Kejetia Market',
    region: 'Ashanti Region',
    collectors: 189,
    comingSoon: false,
    position: { top: '45%', left: '35%' }
  },
  {
    id: 'sunyani-hub',
    name: 'Sunyani Hub',
    location: 'Central Market',
    region: 'Bono Region',
    collectors: null,
    comingSoon: true,
    position: { top: '45%', left: '35%' }
  },
  {
    id: 'ho-hub',
    name: 'Ho Hub',
    location: 'Main Market',
    region: 'Volta Region',
    collectors: null,
    comingSoon: true,
    position: { top: '50%', right: '25%' }
  },
  {
    id: 'tamale-hub',
    name: 'Tamale Hub',
    location: 'Central Market',
    region: 'Northern Region',
    collectors: 142,
    comingSoon: false,
    position: { top: '12%', left: '50%' }
  },
  {
    id: 'cape-coast-hub',
    name: 'Cape Coast Hub',
    location: 'Kotokuraba Market',
    region: 'Central Region',
    collectors: 96,
    comingSoon: false,
    position: { bottom: '35%', left: '28%' }
  },
  {
    id: 'takoradi-hub',
    name: 'Takoradi Hub',
    location: 'Market Circle',
    region: 'Western Region',
    collectors: null,
    comingSoon: true,
    position: { bottom: '38%', left: '20%' }
  },
  {
    id: 'koforidua-hub',
    name: 'Koforidua Hub',
    location: 'Main Market',
    region: 'Eastern Region',
    collectors: null,
    comingSoon: true,
    position: { top: '50%', right: '28%' }
  },
  {
    id: 'wa-hub',
    name: 'Wa Hub',
    location: 'Town Centre',
    region: 'Upper West Region',
    collectors: null,
    comingSoon: true,
    position: { top: '15%', left: '30%' }
  },
  {
    id: 'bolgatanga-hub',
    name: 'Bolgatanga Hub',
    location: 'Central Market',
    region: 'Upper East Region',
    collectors: null,
    comingSoon: true,
    position: { top: '10%', right: '35%' }
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const [selectedHub, setSelectedHub] = useState('tema-hub');
  return (
    <div className="w-full">
      <AIFloatingButton onNavigate={onNavigate} />
      <CustomerServiceChatbot />
      <SeeAndReportPopup onNavigate={onNavigate} />
      {/* Minimal Top Banner */}
      <div className="bg-[#08A26F] text-white py-2.5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Sparkles className="h-4 w-4" />
            <span className="font-bold">
              {"Get AI health insights and solutions for your area".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.03,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: 2.5
                  }}
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            <button
              onClick={() => onNavigate("location-insights")}
              className="underline hover:no-underline ml-1"
            >
              Explore now
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section - Clean & Minimal */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-4 py-2 rounded-full">
                  <div className="h-2 w-2 rounded-full bg-[#FBBF24]"></div>
                  <span className="text-sm text-gray-700">
                    Health-Tech for Ghana
                  </span>
                </div>

                <div>
                  <h1 className="text-5xl md:text-6xl mb-6 text-gray-900 leading-tight font-bold">
                    Transform plastic into
                    <span className="block text-[#10b981] mt-2">
                      predictive health
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    We turn plastic pollution into health
                    intelligence and healthcare access funding
                    for every Ghanaian.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => onNavigate("login")}
                    className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full px-8 w-full sm:w-auto h-14 text-lg"
                  >
                    Join Sankofa
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() =>
                      onNavigate("location-insights")
                    }
                    className="border-2 border-gray-300 hover:border-gray-400 rounded-full px-8 w-full sm:w-auto h-14 text-lg"
                  >
                    Check Health Insights
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div>
                    <div className="text-2xl text-gray-900 mb-1">
                      2,847
                    </div>
                    <div className="text-xs text-gray-600">
                      Tons Recycled
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl text-gray-900 mb-1">
                      12.4K
                    </div>
                    <div className="text-xs text-gray-600">
                      With NHIS Access
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl text-gray-900 mb-1">
                      GH₵1.2M
                    </div>
                    <div className="text-xs text-gray-600">
                      Into Healthcare
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1710093072220-3fa669053619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHaGFuYSUyMHJlY3ljbGluZyUyMHBsYXN0aWN8ZW58MXx8fHwxNzYxMzc5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Recycling plastic"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1634710664586-fe890319a9fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwY29tbXVuaXR5JTIwaGVhbHRofGVufDF8fHx8MTc2MTM3OTYzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Community health"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-[#FBBF24] rounded-3xl p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-gray-900" />
                      <span className="text-sm text-gray-900">
                        AI-Powered
                      </span>
                    </div>
                    <div className="text-2xl text-gray-900">
                      Health insights for your community
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Clean Cards */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl text-gray-900 mb-4 font-bold">
                  Transforming plastic pollution into health protection
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  A comprehensive ecosystem connecting environmental action to predictive health intelligence and healthcare access funding for Ghanaian communities.
                </p>
                <button
                  onClick={() => onNavigate("about")}
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Learn More
                  <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-gray-900" />
                  </div>
                </button>
              </div>

              {/* Right Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Plastic Collection */}
                <Card 
                  onClick={() => onNavigate("collector")}
                  className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-all cursor-pointer hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-[#FBBF24]/20 flex items-center justify-center mb-4">
                      <Recycle className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900">
                      Plastic Collection
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                      Earn cash + NHIS savings
                    </p>
                  </div>
                </Card>

                {/* Hub Management */}
                <Card 
                  onClick={() => onNavigate("hub-manager")}
                  className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-all cursor-pointer hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-[#FBBF24]/20 flex items-center justify-center mb-4">
                      <MapPin className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900">
                      Hub Management
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                      Manage collection operations
                    </p>
                  </div>
                </Card>

                {/* Health Intelligence */}
                <Card 
                  onClick={() => onNavigate("location-insights")}
                  className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-all cursor-pointer hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-[#FBBF24]/20 flex items-center justify-center mb-4">
                      <TrendingUp className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900">
                      Health Intelligence
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                      AI-powered risk insights
                    </p>
                  </div>
                </Card>

                {/* USSD Access */}
                <Card 
                  onClick={() => onNavigate("contact")}
                  className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-all cursor-pointer hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-[#FBBF24]/20 flex items-center justify-center mb-4">
                      <Shield className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900">
                      USSD/SMS Access
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                      For feature phones
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Feature - Modern Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 py-20 md:py-28">

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm">
                  Powered by Advanced AI
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl text-white mb-6 font-bold">
                Meet{" "}
                <span className="text-[#08A26F]">
                  Sankofa AI
                </span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Your intelligent health assistant that
                transforms plastic pollution data into
                actionable health insights for every community
                in Ghana
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 items-center mb-12">
              {/* AI Visual/Features */}
              <div className="order-2 md:order-1">
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#08A26F] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg text-white mb-2">
                          Instant Health Intelligence
                        </h4>
                        <p className="text-white/70 text-sm">
                          Ask questions about health risks,
                          plastic pollution, and prevention
                          strategies. Get personalized insights
                          for your specific area in Ghana.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#08A26F] flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg text-white mb-2">
                          Voice & Chat Support
                        </h4>
                        <p className="text-white/70 text-sm">
                          Speak naturally or type your
                          questions. Available 24/7 in English
                          and local languages. Perfect for all
                          literacy levels.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#08A26F] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg text-white mb-2">
                          Location-Based Insights
                        </h4>
                        <p className="text-white/70 text-sm">
                          Get specific health data for Accra,
                          Kumasi, Tamale, and other regions.
                          Learn about malaria risk, water
                          quality, and air pollution.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Orb Visual */}
              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative">
                  {/* Main orb */}
                  <div className="relative w-56 h-56 md:w-64 md:h-64">
                    <div className="absolute inset-0 rounded-full bg-[#08A26F] opacity-80" />

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-white animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => onNavigate("ai-assistant")}
                className="bg-[#08A26F] hover:bg-[#08A26F]/90 text-white rounded-full px-8 shadow-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Talk to Sankofa AI
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-white/60 text-sm mt-4">
                Free for all users • Available via web, USSD,
                and SMS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem - Simplified */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl text-gray-900 mb-4 font-bold">
                The Challenge We're Solving
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Plastic pollution creates a devastating health
                crisis across Ghana
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-4">
                  <Droplets className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3 font-bold">
                  Vector-Borne Diseases
                </h3>
                <p className="text-gray-600">
                  Stagnant water in plastic waste breeds
                  mosquitoes, spreading malaria and dengue
                </p>
              </div>

              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 mx-auto mb-4">
                  <Wind className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3 font-bold">
                  Respiratory Illness
                </h3>
                <p className="text-gray-600">
                  Open burning of plastic releases toxic fumes
                  causing severe respiratory problems
                </p>
              </div>

              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3 font-bold">
                  Healthcare Gap
                </h3>
                <p className="text-gray-600">
                  Communities most affected by pollution lack
                  access to affordable healthcare
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Modern Step Cards */}
      <section className="py-20 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl text-gray-900 mb-4 font-bold">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Simple, transparent, impactful
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="h-12 w-12 rounded-full overflow-hidden mb-6 border border-stone-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1579756423478-02bc82a97679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHJlY3ljbGluZyUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjE1MTMxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Collecting plastic"
                    className="h-full w-full object-cover grayscale"
                  />
                </div>
                <h3 className="text-xl text-gray-900 mb-3 font-bold">
                  Collect Plastic
                </h3>
                <p className="text-gray-600 mb-6">
                  Gather plastic waste from your community and
                  bring it to local collection Hubs
                </p>
                <div className="text-xs text-[#10b981] bg-[#10b981]/10 px-3 py-2 rounded-lg inline-block">
                  8,652 active Collectors
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="h-12 w-12 rounded-full overflow-hidden mb-6 border border-stone-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1707999494560-f534cc79298c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwbW9uZXklMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzYxNTEzMTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Cash rewards"
                    className="h-full w-full object-cover grayscale"
                  />
                </div>
                <h3 className="text-xl text-gray-900 mb-3 font-bold">
                  Get Rewarded
                </h3>
                <p className="text-gray-600 mb-6">
                  Receive 70% instant cash + 30% saved as Health
                  Tokens for NHIS enrollment
                </p>
                <div className="text-xs text-[#3b82f6] bg-[#3b82f6]/10 px-3 py-2 rounded-lg inline-block">
                  GH₵1.2M paid out
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="h-12 w-12 rounded-full overflow-hidden mb-6 border border-stone-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1741918773271-decdd1e01476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBsaW5lYXJ0fGVufDF8fHx8MTc2MTUxMzE0OXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="AI technology"
                    className="h-full w-full object-cover grayscale"
                  />
                </div>
                <h3 className="text-xl text-gray-900 mb-3 font-bold">
                  AI Tracks Impact
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI analyzes data to identify health risks
                  and direct prevention efforts
                </p>
                <div className="text-xs text-[#FBBF24] bg-[#FBBF24]/10 px-3 py-2 rounded-lg inline-block">
                  Real-time mapping
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find a Hub Near You */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#08A26F]/10 border border-[#08A26F]/20 px-4 py-2 rounded-full mb-4">
                <MapPin className="h-4 w-4 text-[#08A26F]" />
                <span className="text-sm text-gray-700">
                  Nationwide Network
                </span>
              </div>
              <h2 className="text-4xl text-gray-900 mb-4 font-bold">
                Find a Hub Near You
              </h2>
              <p className="text-gray-600">
                Our collection hubs are expanding across Ghana. Bring your plastic waste to the nearest hub and start earning today.
              </p>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
              {/* Map Section */}
              <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200">
                <h3 className="text-lg text-gray-900 mb-2 font-semibold">
                  Our Collection Hubs
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {hubs.filter(h => !h.comingSoon).length} active hubs across Ghana
                </p>

                {/* Ghana Map Visualization with borders */}
                <div className="relative bg-white rounded-2xl p-8 h-96 border border-stone-200">
                  {/* Ghana map outline */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Simplified Ghana border shape */}
                    <path
                      d="M 180 80 L 220 80 L 240 100 L 250 140 L 260 180 L 270 220 L 280 260 L 285 290 L 280 310 L 260 320 L 230 325 L 200 330 L 170 328 L 140 320 L 120 300 L 110 270 L 105 240 L 100 200 L 105 160 L 120 120 L 150 90 Z"
                      stroke="#D1D5DB"
                      strokeWidth="2"
                      fill="transparent"
                    />
                  </svg>

                  {/* Map pins */}
                  <div className="relative h-full">
                    {/* Active Hub (North - Tamale area) */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2">
                      <div className="relative">
                        <div className="w-3 h-3 bg-[#08A26F] rounded-full ring-2 ring-[#08A26F]/30"></div>
                      </div>
                    </div>

                    {/* Active Hub (Middle left - Kumasi area) */}
                    <div className="absolute top-1/2 left-[35%] -translate-y-1/2">
                      <div className="relative">
                        <div className="w-3 h-3 bg-[#08A26F] rounded-full ring-2 ring-[#08A26F]/30"></div>
                      </div>
                    </div>

                    {/* Active Hub (Bottom left) */}
                    <div className="absolute bottom-[35%] left-[28%]">
                      <div className="w-3 h-3 bg-[#08A26F] rounded-full ring-2 ring-[#08A26F]/30"></div>
                    </div>

                    {/* Dynamic hub pins based on data - only show non-coming soon hubs */}
                    {hubs.filter(hub => !hub.comingSoon).map((hub) => (
                      <div
                        key={hub.id}
                        className="absolute transition-all duration-300"
                        style={hub.position}
                      >
                        <div className="relative">
                          <div 
                            className={`w-3 h-3 rounded-full ring-2 transition-all duration-300 ${
                              selectedHub === hub.id
                                ? 'bg-[#FBBF24] ring-[#FBBF24]/30 scale-110'
                                : 'bg-[#08A26F] ring-[#08A26F]/30'
                            }`}
                          ></div>
                          {selectedHub === hub.id && (
                            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-700 whitespace-nowrap font-medium">
                              {hub.name}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Legend */}
                    <div className="absolute bottom-6 left-6 bg-white rounded-lg p-3 shadow-sm border border-stone-200">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 bg-[#08A26F] rounded-full"></div>
                          <span className="text-gray-700">Active Hub</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                          <span className="text-gray-700">Coming Soon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hubs List with scroll */}
              <div className="relative">
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {hubs.map((hub) => (
                    <div
                      key={hub.id}
                      onClick={() => setSelectedHub(hub.id)}
                      className={`rounded-2xl p-5 transition-all cursor-pointer ${
                        selectedHub === hub.id && !hub.comingSoon
                          ? 'bg-white border-2 border-[#08A26F] shadow-md'
                          : hub.comingSoon
                          ? 'bg-stone-50 border border-stone-200 opacity-70 hover:opacity-80'
                          : 'bg-stone-50 border border-stone-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 ${
                              selectedHub === hub.id
                                ? 'bg-[#08A26F]/10'
                                : 'bg-gray-100'
                            }`}
                          >
                            <MapPin 
                              className={`h-5 w-5 ${
                                selectedHub === hub.id
                                  ? 'text-[#08A26F]'
                                  : 'text-gray-400'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-gray-900 font-semibold">
                                {hub.name}
                              </h4>
                              {hub.comingSoon && (
                                <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mb-1 ${
                              selectedHub === hub.id ? 'text-gray-600' : 'text-gray-500'
                            }`}>
                              {hub.location}
                            </p>
                            {hub.region && (
                              <p className="text-xs text-gray-500">
                                {hub.region}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {hub.collectors ? (
                            <>
                              <div className={`text-2xl font-bold ${
                                selectedHub === hub.id ? 'text-[#08A26F]' : 'text-gray-900'
                              }`}>
                                {hub.collectors}
                              </div>
                              <div className="text-xs text-gray-500">collectors</div>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                              collectors
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured: Health Insights */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-16 md:grid-cols-2 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-white rounded-3xl p-8 border border-stone-200">
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-[#08A26F] transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#08A26F]/10">
                        <Droplets className="h-5 w-5 text-[#08A26F]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 mb-1">
                          Malaria Cases
                        </div>
                        <div className="text-sm text-gray-600">
                          Track weekly disease trends in your area
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-[#08A26F] transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#08A26F]/10">
                        <Wind className="h-5 w-5 text-[#08A26F]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 mb-1">
                          Risk Assessment
                        </div>
                        <div className="text-sm text-gray-600">
                          AI-calculated environmental scores
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-[#08A26F] transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#08A26F]/10">
                        <Shield className="h-5 w-5 text-[#08A26F]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 mb-1">
                          Prevention Tips
                        </div>
                        <div className="text-sm text-gray-600">
                          Personalized health guidance
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 bg-stone-100 px-5 py-2.5 rounded-full mb-6 border border-stone-200">
                  <Sparkles className="h-4 w-4 text-[#08A26F]" />
                  <span className="text-sm text-gray-900">
                    AI-Powered
                  </span>
                </div>
                <h2 className="text-gray-900 mb-6 text-[20px] font-bold">
                  Know Your Area&apos;s Health Risks
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Get AI-analyzed health insights, disease trends, and preventive tips specific to your community. All data is privacy-protected and designed to empower you with knowledge.
                </p>
                <Button
                  size="lg"
                  onClick={() =>
                    onNavigate("location-insights")
                  }
                  className="bg-[#08A26F] hover:bg-[#059669] text-white rounded-full px-8"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explore Health Insights
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See & Report CTA Section */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden border-0 shadow-xl bg-[#08A26F] text-white">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left Side - Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6 w-fit">
                    <Camera className="h-4 w-4 text-white" />
                    <span className="text-sm text-white">Community Action</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl text-white mb-4">
                    See Plastic Waste? Report It!
                  </h2>
                  
                  <p className="text-white/90 mb-6 leading-relaxed text-lg">
                    Help us keep Ghana clean. Report clogged gutters, illegal dumping, 
                    or plastic pollution in your area with just a few photos.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#FBBF24] flex-shrink-0" />
                      <span className="text-white/90">Quick & easy photo upload</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#FBBF24] flex-shrink-0" />
                      <span className="text-white/90">GPS location tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#FBBF24] flex-shrink-0" />
                      <span className="text-white/90">Our team takes action fast</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => onNavigate('see-report')}
                    className="bg-white text-[#08A26F] hover:bg-stone-100 rounded-full px-8 w-fit"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Report an Issue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {/* Right Side - Image */}
                <div className="relative h-64 md:h-auto">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1662534264036-7bfa0d35de9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG9nZ2VkJTIwZ3V0dGVyJTIwcGxhc3RpYyUyMHdhc3RlJTIwYWZyaWNhfGVufDF8fHx8MTc2MTU1MDIzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Plastic waste in community"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sankofa Principle */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-stone-50 rounded-3xl p-12 text-center border border-stone-200">
              <div className="mb-6 w-20 h-20 mx-auto">
                <img 
                  src={imgRectangle10} 
                  alt="Sankofa-Coin Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="text-2xl text-gray-900 mb-4 text-[32px] font-bold">
                The Sankofa Principle
              </h3>
              <p className="text-lg text-[#10b981] mb-3">
                "Se wo were fi na wosankofa a yenkyi"
              </p>
              <p className="text-gray-600 leading-relaxed">
                "It is not wrong to go back for that which you
                have forgotten." We look to our past to build a
                healthier future, transforming yesterday's waste
                into tomorrow's wellness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Support Section */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-3">
                Multiple Ways to Support
              </h2>
              <p className="text-gray-600">
                Whether you collect, volunteer, or donate - every action counts
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border border-stone-200 bg-white rounded-2xl overflow-hidden hover:border-[#08A26F] transition-colors">
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1756362399416-503694e40cf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwcmVjeWNsaW5nJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NjE1MTEzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Plastic collection and recycling"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-gray-900 mb-2 text-[20px]">Collect Plastic</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Earn rewards while cleaning your community and improving health outcomes
                  </p>
                  <Button
                    onClick={() => onNavigate("collector")}
                    className="bg-[#08A26F] hover:bg-[#059669] rounded-full w-full"
                  >
                    Start Collecting
                  </Button>
                </div>
              </Card>

              <Card className="border border-stone-200 bg-white rounded-2xl overflow-hidden hover:border-[#08A26F] transition-colors">
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJzJTIwaGVscGluZ3xlbnwxfHx8fDE3NjE0NTM0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Community volunteers helping together"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-gray-900 mb-2 text-[20px]">Volunteer</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Contribute your time and skills to expand our community impact
                  </p>
                  <Button
                    onClick={() => onNavigate("volunteer")}
                    className="bg-[#08A26F] hover:bg-[#059669] rounded-full w-full"
                  >
                    Volunteer Now
                  </Button>
                </div>
              </Card>

              <Card className="border border-stone-200 bg-white rounded-2xl overflow-hidden hover:border-[#FBBF24] transition-colors">
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1663181889781-19f3b9d185eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMGdpdmluZyUyMGRvbmF0aW9ufGVufDF8fHx8MTc2MTUxMTMzN3ww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Hands giving donation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-gray-900 mb-2 text-[20px]">Donate</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Fund collection programs, healthcare access, and health intelligence
                  </p>
                  <Button
                    onClick={() => onNavigate("donations")}
                    className="bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-900 rounded-full w-full"
                  >
                    Make a Donation
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1758599668924-02f56a9aacc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBjb2xsZWN0aW5nJTIwcGxhc3RpYyUyMHdhc3RlfGVufDF8fHx8MTc2MTUxMjE1OXww&ixlib=rb-4.1.0&q=80&w=1080')" }}
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/80 bg-[rgba(0,0,0,0.78)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl mb-6 font-bold">
              Ready to Make an Impact?
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Join thousands of Ghanaians turning plastic waste
              into health protection and affordable healthcare
              access.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate("login")}
                className="bg-[#10b981] hover:bg-[#059669] text-white rounded-full px-8"
              >
                Join Sankofa Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("messaging")}
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#1a1a1a] rounded-full px-8"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}