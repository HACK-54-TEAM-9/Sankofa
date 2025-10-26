import { CTAButtons } from "./CTAButtons";
import { AIFloatingButton } from "./AIFloatingButton";
import { CustomerServiceChatbot } from "./CustomerServiceChatbot";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
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
  Award,
  Quote,
} from "lucide-react";

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
              Get AI health insights and solutions for your area
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
      <section className="bg-white h-[calc(100vh-5rem)] flex items-center">
        <div className="container mx-auto px-4">
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
                    <img
                      src="https://images.unsplash.com/photo-1710093072220-3fa669053619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHaGFuYSUyMHJlY3ljbGluZyUyMHBsYXN0aWN8ZW58MXx8fHwxNzYxMzc5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Recycling plastic"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
                    <img
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
      <section className="py-20 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl text-gray-900 mb-4 font-normal font-bold">
                Our Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A comprehensive ecosystem connecting
                environmental action to health protection
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Plastic Collection Card */}
              <Card className="bg-white border-0 shadow-sm rounded-3xl p-8 md:p-10 hover:shadow-lg transition-shadow">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10b981]/10 mb-6">
                  <Recycle className="h-7 w-7 text-[#10b981]" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-4">
                  Plastic Collection
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Collect plastic waste from your community and
                  receive instant payment plus healthcare
                  savings through our Dual Reward Split system.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#10b981]" />
                    <span className="text-sm text-gray-700">
                      70% instant cash payment
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#10b981]" />
                    <span className="text-sm text-gray-700">
                      30% saved for NHIS enrollment
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#10b981]" />
                    <span className="text-sm text-gray-700">
                      Track your impact in real-time
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate("collector")}
                  className="text-[#10b981] hover:text-[#059669] inline-flex items-center gap-2"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Card>

              {/* Health Intelligence Card */}
              <Card className="bg-white border-0 shadow-sm rounded-3xl p-8 md:p-10 hover:shadow-lg transition-shadow">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3b82f6]/10 mb-6">
                  <TrendingUp className="h-7 w-7 text-[#3b82f6]" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-4">
                  Predictive Health Intelligence
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  AI-powered analysis of plastic collection data
                  to identify health risk zones and direct
                  prevention efforts where they're needed most.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#3b82f6]" />
                    <span className="text-sm text-gray-700">
                      Real-time risk mapping
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#3b82f6]" />
                    <span className="text-sm text-gray-700">
                      Disease trend analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#3b82f6]" />
                    <span className="text-sm text-gray-700">
                      Personalized prevention tips
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    onNavigate("location-insights")
                  }
                  className="text-[#3b82f6] hover:text-[#2563eb] inline-flex items-center gap-2"
                >
                  Explore Insights
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Card>
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
      <section className="py-20 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Simple, transparent, impactful
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10b981] text-white mb-6 text-xl">
                  1
                </div>
                <h3 className="text-xl text-gray-900 mb-3">
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6] text-white mb-6 text-xl">
                  2
                </div>
                <h3 className="text-xl text-gray-900 mb-3">
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FBBF24] text-gray-900 mb-6 text-xl">
                  3
                </div>
                <h3 className="text-xl text-gray-900 mb-3">
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
              <div className="text-5xl mb-6">🐦</div>
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

      {/* Ways to Support Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#FBBF24]/10 to-[#10b981]/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
                Multiple Ways to Support
              </h2>
              <p className="text-lg text-gray-600">
                Whether you collect, volunteer, or donate - every action counts
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-0 shadow-sm rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
                  <Recycle className="h-8 w-8 text-[#10b981]" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">Collect Plastic</h3>
                <p className="text-gray-600 mb-6">
                  Earn rewards while cleaning your community and improving health outcomes
                </p>
                <Button
                  onClick={() => onNavigate("collector")}
                  className="bg-[#10b981] hover:bg-[#059669] rounded-full w-full"
                >
                  Start Collecting
                </Button>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">Volunteer</h3>
                <p className="text-gray-600 mb-6">
                  Contribute your time and skills to expand our community impact
                </p>
                <Button
                  onClick={() => onNavigate("volunteer")}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] rounded-full w-full"
                >
                  Volunteer Now
                </Button>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-[#FBBF24]/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-[#FBBF24]" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">Donate</h3>
                <p className="text-gray-600 mb-6">
                  Fund collection programs, healthcare access, and health intelligence
                </p>
                <Button
                  onClick={() => onNavigate("donations")}
                  className="bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-900 rounded-full w-full"
                >
                  Make a Donation
                </Button>
              </Card>
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