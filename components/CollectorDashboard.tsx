import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from './AuthContext';
import {
  Wallet,
  TrendingUp,
  Calendar,
  Award,
  MapPin,
  Package,
  Heart,
  Users,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Activity,
  Target,
} from 'lucide-react';

interface CollectorDashboardProps {
  onNavigate: (page: string) => void;
}

export function CollectorDashboard({ onNavigate }: CollectorDashboardProps) {
  const { user } = useAuth();
  const [selectedMonth] = useState('October 2025');

  // Mock data
  const stats = {
    totalEarnings: 456.50,
    pendingEarnings: 45.20,
    thisMonth: 234.80,
    plasticCollected: 1247, // kg
    healthcareContribution: 228.25,
    personalWallet: 228.25,
    collectionsThisMonth: 23,
    rank: 'Bronze Collector',
    nextRank: 'Silver Collector',
    rankProgress: 65,
  };

  const recentCollections = [
    { date: '2025-10-24', weight: 45, earnings: 22.50, status: 'completed', hub: 'Accra Central Hub' },
    { date: '2025-10-22', weight: 38, earnings: 19.00, status: 'completed', hub: 'Accra Central Hub' },
    { date: '2025-10-20', weight: 52, earnings: 26.00, status: 'processing', hub: 'Tema Industrial Hub' },
    { date: '2025-10-18', weight: 41, earnings: 20.50, status: 'completed', hub: 'Accra Central Hub' },
    { date: '2025-10-15', weight: 35, earnings: 17.50, status: 'completed', hub: 'Accra Central Hub' },
  ];

  const healthImpact = {
    diseasesTracked: 12,
    communityCases: 345,
    yourContribution: '4.2%',
    areasImproved: ['Malaria Prevention', 'Water Quality', 'Waste Management'],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] px-4 py-2 rounded-full mb-4 shadow-sm">
                  <Award className="h-4 w-4 text-gray-900" />
                  <span className="text-sm text-gray-900">{stats.rank}</span>
                </div>
                <h1 className="text-gray-900 mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-lg text-gray-600">
                  {stats.collectionsThisMonth} collections this month • Keep up the great work
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => onNavigate('location-insights')}
                  className="bg-[#10b981] hover:bg-[#059669] text-white rounded-full px-6 shadow-sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Health Insights
                </Button>
                <Button
                  onClick={() => onNavigate('messaging')}
                  variant="outline"
                  className="border-2 border-gray-200 rounded-full px-6 hover:border-gray-300"
                >
                  Messages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] mb-4 shadow-sm">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
                <div className="text-gray-900 mb-2">GH₵{stats.totalEarnings.toFixed(2)}</div>
                <div className="flex items-center gap-1 text-sm text-[#10b981]">
                  <TrendingUp className="h-3 w-3" />
                  <span>+18% this month</span>
                </div>
              </Card>

              <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] mb-4 shadow-sm">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">This Month</p>
                <div className="text-gray-900 mb-2">GH₵{stats.thisMonth.toFixed(2)}</div>
                <p className="text-sm text-gray-500">{stats.collectionsThisMonth} collections</p>
              </Card>

              <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] mb-4 shadow-sm">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Plastic Collected</p>
                <div className="text-gray-900 mb-2">{stats.plasticCollected} kg</div>
                <p className="text-sm text-gray-500">All time total</p>
              </Card>

              <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] mb-4 shadow-sm">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Health Impact</p>
                <div className="text-gray-900 mb-2">GH₵{stats.healthcareContribution.toFixed(2)}</div>
                <p className="text-sm text-gray-500">Healthcare funded</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="collections" className="space-y-6">
              <TabsList className="bg-white rounded-full p-1 shadow-sm border border-gray-100">
                <TabsTrigger value="collections" className="rounded-full px-6 data-[state=active]:bg-[#10b981] data-[state=active]:text-white">Recent Collections</TabsTrigger>
                <TabsTrigger value="health" className="rounded-full px-6 data-[state=active]:bg-[#10b981] data-[state=active]:text-white">Health Impact</TabsTrigger>
                <TabsTrigger value="rank" className="rounded-full px-6 data-[state=active]:bg-[#10b981] data-[state=active]:text-white">Rank Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="collections">
                <Card className="border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl text-gray-900">Recent Collections</h2>
                    <Badge className="bg-[#10b981]/10 text-[#10b981] border-0 rounded-full px-4 py-1">
                      {recentCollections.length} total
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {recentCollections.map((collection, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50/50 rounded-xl gap-4 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10b981]/10 flex-shrink-0">
                            <Package className="h-5 w-5 text-[#10b981]" />
                          </div>
                          <div>
                            <div className="text-gray-900 mb-1">{collection.weight} kg collected</div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                              <MapPin className="h-3 w-3" />
                              {collection.hub}
                            </div>
                            <div className="text-sm text-gray-400">{collection.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                          <div className="text-lg text-gray-900">GH₵{collection.earnings.toFixed(2)}</div>
                          <Badge
                            className={
                              collection.status === 'completed'
                                ? 'bg-[#10b981]/10 text-[#10b981] border-0 rounded-full px-3 py-1'
                                : 'bg-[#FBBF24]/10 text-[#FBBF24] border-0 rounded-full px-3 py-1'
                            }
                          >
                            {collection.status === 'completed' ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {collection.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="health">
                <Card className="border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 bg-white">
                  <h2 className="text-xl text-gray-900 mb-6">Your Health Impact</h2>
                  
                  <div className="grid gap-5 md:grid-cols-3 mb-8">
                    <div className="p-6 bg-gradient-to-br from-[#3b82f6]/5 to-[#3b82f6]/10 rounded-xl border border-[#3b82f6]/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] mb-3 shadow-sm">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-2xl text-gray-900 mb-1">{healthImpact.diseasesTracked}</div>
                      <p className="text-sm text-gray-500">Diseases Tracked</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[#8b5cf6]/5 to-[#8b5cf6]/10 rounded-xl border border-[#8b5cf6]/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] mb-3 shadow-sm">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-2xl text-gray-900 mb-1">{healthImpact.communityCases}</div>
                      <p className="text-sm text-gray-500">Community Cases</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[#10b981]/5 to-[#10b981]/10 rounded-xl border border-[#10b981]/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] mb-3 shadow-sm">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-2xl text-gray-900 mb-1">{healthImpact.yourContribution}</div>
                      <p className="text-sm text-gray-500">Your Contribution</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-gray-900 mb-4">Areas You&apos;re Helping Improve</h3>
                    <div className="space-y-2">
                      {healthImpact.areasImproved.map((area, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-200 transition-all">
                          <CheckCircle2 className="h-5 w-5 text-[#10b981] flex-shrink-0" />
                          <span className="text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => onNavigate('location-insights')}
                    className="w-full bg-[#10b981] hover:bg-[#059669] text-white rounded-full py-6 shadow-sm"
                  >
                    View Detailed Health Insights
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="rank">
                <Card className="border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 bg-white">
                  <h2 className="text-xl text-gray-900 mb-6">Rank Progress</h2>
                  
                  <div className="mb-8 p-6 bg-gradient-to-br from-[#FBBF24]/5 to-[#FBBF24]/10 rounded-xl border border-[#FBBF24]/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] shadow-sm">
                          <Award className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <div className="text-lg text-gray-900">{stats.rank}</div>
                          <p className="text-sm text-gray-500">Current Rank</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl text-gray-900">{stats.rankProgress}%</div>
                        <p className="text-sm text-gray-500">to {stats.nextRank}</p>
                      </div>
                    </div>
                    <Progress value={stats.rankProgress} className="h-2 mb-3" />
                    <p className="text-sm text-gray-500">
                      Collect 450 more kg to reach {stats.nextRank}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-900 mb-4">Silver Collector Benefits</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-200 transition-all">
                        <CheckCircle2 className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-gray-900 mb-1">+10% Bonus on Collections</div>
                          <p className="text-sm text-gray-500">Earn more for every kilogram collected</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-200 transition-all">
                        <CheckCircle2 className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-gray-900 mb-1">Priority Pickup Scheduling</div>
                          <p className="text-sm text-gray-500">Get preferred time slots at collection hubs</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-200 transition-all">
                        <CheckCircle2 className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-gray-900 mb-1">Exclusive Health Workshops</div>
                          <p className="text-sm text-gray-500">Access to premium health education sessions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-200 transition-all">
                        <CheckCircle2 className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-gray-900 mb-1">Monthly Performance Bonus</div>
                          <p className="text-sm text-gray-500">Additional rewards for consistent collecting</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-[#10b981] via-[#14b8a6] to-[#3b82f6] rounded-2xl p-8 md:p-12 text-center shadow-lg border border-white/10">
              <h2 className="text-2xl md:text-3xl text-white mb-4">
                Keep Making an Impact
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Your collections are making a real difference in community health. Keep up the amazing work!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => onNavigate('location-insights')}
                  className="bg-white text-[#10b981] hover:bg-gray-50 rounded-full px-8 shadow-sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  View Health Data
                </Button>
                <Button
                  onClick={() => onNavigate('ai-assistant')}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#10b981] rounded-full px-8"
                >
                  Ask AI Assistant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
