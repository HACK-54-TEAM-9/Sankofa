import { CTAButtons } from "./CTAButtons";
import { ImpactMetric } from "./ImpactMetric";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AIFloatingButton } from "./AIFloatingButton";
import { CustomerServiceChatbot } from "./CustomerServiceChatbot";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import logoImage from '../assets/logo.png';
import {
  Recycle,
  Droplets,
  Wind,
  Shield,
  TrendingUp,
  Users,
  MapPin,
  Sparkles,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="w-full">
      <AIFloatingButton onNavigate={onNavigate} />
      <CustomerServiceChatbot />
      {/* Minimal Top Banner */}
      <div className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white py-2.5">
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

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    onClick={() => onNavigate("login")}
                    className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full px-8"
                  >
                    Join Sankofa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() =>
                      onNavigate("location-insights")
                    }
                    className="border-2 border-gray-300 hover:border-gray-400 rounded-full px-8"
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
      <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl text-gray-900 mb-4">
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
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
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
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
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
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
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
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1f1f] via-[#0d2d3d] to-[#1a4d5c] py-20 md:py-28">
        {/* Gradient Overlay Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm">
                  Powered by Advanced AI
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl text-white mb-6">
                Meet{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
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
                  {/* Outer glow */}
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl opacity-30"
                    style={{
                      width: "280px",
                      height: "280px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />

                  {/* Main orb */}
                  <div className="relative w-56 h-56 md:w-64 md:h-64">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 opacity-80" />
                    <div
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{
                        background: `
                          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px),
                          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)
                        `,
                      }}
                    />
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 blur-xl opacity-60" />

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
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-full px-8 shadow-lg shadow-blue-500/30"
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
              <h2 className="text-4xl text-gray-900 mb-4">
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
                <h3 className="text-xl text-gray-900 mb-3">
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
                <h3 className="text-xl text-gray-900 mb-3">
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
                <h3 className="text-xl text-gray-900 mb-3">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center mb-4">
                <Recycle className="h-8 w-8 text-[#08A26F]" />
              </div>
              <h2 className="text-4xl text-gray-900 mb-3">
                How It Works
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Join thousands of collectors transforming plastic waste into healthcare access and community health insights
              </p>
            </div>

            {/* Process Flow */}
            <div className="relative">
              {/* Desktop: Horizontal Layout */}
              <div className="hidden md:flex items-start justify-between gap-8 relative">
                {/* Step 1 */}
                <div className="flex-1 text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute top-1/2 left-full w-32 h-0.5 border-t-2 border-dashed border-stone-300 -translate-y-1/2"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-[#08A26F]/20 mx-auto">
                      <Users className="h-9 w-9 text-[#08A26F]" />
                      <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#08A26F] text-white">
                        1
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-900 mb-3">
                    Register
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Visit a collection hub and register with your phone number, name, and neighborhood to get started
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex-1 text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute top-1/2 left-full w-32 h-0.5 border-t-2 border-dashed border-stone-300 -translate-y-1/2"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-[#08A26F]/20 mx-auto">
                      <Recycle className="h-9 w-9 text-[#08A26F]" />
                      <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#08A26F] text-white">
                        2
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-900 mb-3">
                    Collect & Deliver
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Gather clean, sorted plastic waste and bring it to your local hub for weighing and payment
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex-1 text-center">
                  <div className="relative inline-block mb-6">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-[#FBBF24]/20 mx-auto">
                      <Sparkles className="h-9 w-9 text-[#FBBF24]" />
                      <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#FBBF24] text-gray-900">
                        3
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-900 mb-3">
                    Earn & Impact
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Receive instant cash plus Health Tokens while helping AI track community health risks
                  </p>
                </div>
              </div>

              {/* Mobile: Vertical Layout */}
              <div className="flex md:hidden flex-col gap-8">
                {/* Step 1 */}
                <div className="flex gap-6">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-[#08A26F]/20">
                      <Users className="h-7 w-7 text-[#08A26F]" />
                      <div className="absolute -top-1.5 -left-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#08A26F] text-white text-sm">
                        1
                      </div>
                    </div>
                    <div className="w-0.5 h-16 border-l-2 border-dashed border-stone-300 mt-2"></div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl text-gray-900 mb-2">
                      Register
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Visit a collection hub and register with your phone number, name, and neighborhood to get started
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-6">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-[#08A26F]/20">
                      <Recycle className="h-7 w-7 text-[#08A26F]" />
                      <div className="absolute -top-1.5 -left-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#08A26F] text-white text-sm">
                        2
                      </div>
                    </div>
                    <div className="w-0.5 h-16 border-l-2 border-dashed border-stone-300 mt-2"></div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl text-gray-900 mb-2">
                      Collect & Deliver
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Gather clean, sorted plastic waste and bring it to your local hub for weighing and payment
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-[#FBBF24]/20">
                      <Sparkles className="h-7 w-7 text-[#FBBF24]" />
                      <div className="absolute -top-1.5 -left-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#FBBF24] text-gray-900 text-sm">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl text-gray-900 mb-2">
                      Earn & Impact
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Receive instant cash plus Health Tokens while helping AI track community health risks
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-16 pt-12 border-t border-stone-200">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-[#08A26F] mb-1">8,652</p>
                  <p className="text-xs text-gray-500">Active Collectors</p>
                </div>
                <div>
                  <p className="text-[#08A26F] mb-1">GH₵1.2M</p>
                  <p className="text-xs text-gray-500">Paid Out</p>
                </div>
                <div>
                  <p className="text-[#FBBF24] mb-1">Real-time</p>
                  <p className="text-xs text-gray-500">Health Mapping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured: Health Insights */}
      <section className="py-24 bg-gradient-to-br from-[#10b981]/5 via-white to-[#3b82f6]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-16 md:grid-cols-2 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-red-50 to-red-50/50 rounded-2xl border border-red-100/50 hover:border-red-200 transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                        <Droplets className="h-5 w-5 text-white" />
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

                    <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-amber-50 to-amber-50/50 rounded-2xl border border-amber-100/50 hover:border-amber-200 transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
                        <Wind className="h-5 w-5 text-white" />
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

                    <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-emerald-50 to-emerald-50/50 rounded-2xl border border-emerald-100/50 hover:border-emerald-200 transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] shadow-sm">
                        <Shield className="h-5 w-5 text-white" />
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
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] px-5 py-2.5 rounded-full mb-6 shadow-sm">
                  <Sparkles className="h-4 w-4 text-gray-900" />
                  <span className="text-sm text-gray-900">
                    AI-Powered
                  </span>
                </div>
                <h2 className="text-gray-900 mb-6">
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
                  className="bg-[#10b981] hover:bg-[#059669] text-white rounded-full px-8 shadow-sm hover:shadow-md transition-all"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explore Health Insights
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sankofa Principle */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#10b981]/5 to-[#14b8a6]/5 rounded-3xl p-12 text-center border border-[#10b981]/10">
            <div className="flex justify-center mb-6">
              <img src={logoImage} alt="Sankofa Logo" className="h-20 w-20 object-contain" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-4">
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

      {/* Final CTA */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl mb-6">
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
                className="border-2 border-white text-white hover:bg-white hover:text-[#1a1a1a] rounded-full px-8"
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
