import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from './AuthContext';
import {
  Building2,
  Users,
  Package,
  TrendingUp,
  MapPin,
  Activity,
  DollarSign,
  Calendar,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ArrowUpRight,
} from 'lucide-react';

interface HubManagerDashboardProps {
  onNavigate: (page: string) => void;
}

export function HubManagerDashboard({ onNavigate }: HubManagerDashboardProps) {
  const { user } = useAuth();

  // Mock data
  const stats = {
    hubName: 'Accra Central Hub',
    totalCollectors: 127,
    activeToday: 34,
    plasticProcessed: 3456, // kg this month
    monthlyRevenue: 1728.00,
    healthContribution: 864.00,
    collectionsToday: 23,
    pendingVerification: 5,
  };

  const topCollectors = [
    { name: 'Ama Mensah', collections: 45, weight: 567, earnings: 283.50, rank: 1 },
    { name: 'Kwame Osei', collections: 42, weight: 523, earnings: 261.50, rank: 2 },
    { name: 'Abena Asare', collections: 38, weight: 489, earnings: 244.50, rank: 3 },
    { name: 'Kofi Mensah', collections: 35, weight: 445, earnings: 222.50, rank: 4 },
    { name: 'Yaa Adjei', collections: 32, weight: 412, earnings: 206.00, rank: 5 },
  ];

  const recentActivity = [
    { time: '10 mins ago', collector: 'Ama Mensah', action: 'Drop-off', weight: 45, status: 'verified' },
    { time: '25 mins ago', collector: 'Kwame Osei', action: 'Drop-off', weight: 38, status: 'verified' },
    { time: '1 hour ago', collector: 'Abena Asare', action: 'Drop-off', weight: 52, status: 'pending' },
    { time: '2 hours ago', collector: 'Kofi Mensah', action: 'Drop-off', weight: 41, status: 'verified' },
    { time: '3 hours ago', collector: 'Yaa Adjei', action: 'Drop-off', weight: 35, status: 'verified' },
  ];

  const weeklyData = [
    { day: 'Mon', collections: 45, weight: 567 },
    { day: 'Tue', collections: 52, weight: 643 },
    { day: 'Wed', collections: 48, weight: 592 },
    { day: 'Thu', collections: 56, weight: 698 },
    { day: 'Fri', collections: 61, weight: 756 },
    { day: 'Sat', collections: 38, weight: 471 },
    { day: 'Sun', collections: 23, weight: 289 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-4 py-2 rounded-full mb-4 shadow-sm">
                  <Building2 className="h-4 w-4 text-white" />
                  <span className="text-sm text-white">{stats.hubName}</span>
                </div>
                <h1 className="text-gray-900 mb-2">
                  Hub Manager Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  {stats.activeToday} collectors active today • {stats.collectionsToday} collections processed
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => onNavigate('data')}
                  className="bg-[#10b981] hover:bg-[#059669] text-white rounded-full px-6 shadow-sm"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] mb-4 shadow-sm">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Collectors</p>
                <div className="text-gray-900 mb-2">{stats.totalCollectors}</div>
                <div className="flex items-center gap-1 text-sm text-[#3b82f6]">
                  <Activity className="h-3 w-3" />
                  <span>{stats.activeToday} active today</span>
                </div>
              </Card>

              <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] mb-4 shadow-sm">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Plastic Processed</p>
                <div className="text-gray-900 mb-2">{stats.plasticProcessed} kg</div>
                <p className="text-sm text-gray-500">This month</p>
              </Card>

              <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] mb-4 shadow-sm">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Monthly Revenue</p>
                <div className="text-gray-900 mb-2">GH₵{stats.monthlyRevenue.toFixed(2)}</div>
                <div className="flex items-center gap-1 text-sm text-[#8b5cf6]">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% from last month</span>
                </div>
              </Card>

              <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] mb-4 shadow-sm">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <div className="text-gray-900 mb-2">{stats.pendingVerification}</div>
                <p className="text-sm text-gray-500">Awaiting verification</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="activity" className="space-y-6">
              <TabsList className="bg-white rounded-full p-1 shadow-sm border border-gray-100">
                <TabsTrigger value="activity" className="rounded-full px-6 data-[state=active]:bg-[#10b981] data-[state=active]:text-white">Recent Activity</TabsTrigger>
                <TabsTrigger value="collectors" className="rounded-full px-6 data-[state=active]:bg-[#10b981] data-[state=active]:text-white">Top Collectors</TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-full px-6 data-[state=active]:bg-[#10b981] data-[state=active]:text-white">Weekly Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                <Card className="border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl text-gray-900">Recent Activity</h2>
                    <Badge className="bg-[#3b82f6]/10 text-[#3b82f6] border-0 rounded-full px-4 py-1 w-fit">
                      {stats.collectionsToday} collections today
                    </Badge>
                  </div>
                  <div className="space-y-3 mb-6">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50/50 rounded-xl gap-4 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6]/10 flex-shrink-0">
                            <Package className="h-5 w-5 text-[#3b82f6]" />
                          </div>
                          <div>
                            <div className="text-gray-900 mb-1">{activity.collector}</div>
                            <div className="text-sm text-gray-500 mb-1">{activity.weight} kg • {activity.action}</div>
                            <div className="text-sm text-gray-400">{activity.time}</div>
                          </div>
                        </div>
                        <Badge
                          className={
                            activity.status === 'verified'
                              ? 'bg-[#10b981]/10 text-[#10b981] border-0 rounded-full px-3 py-1'
                              : 'bg-[#FBBF24]/10 text-[#FBBF24] border-0 rounded-full px-3 py-1'
                          }
                        >
                          {activity.status === 'verified' ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {stats.pendingVerification > 0 && (
                    <Button className="w-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] hover:opacity-90 text-gray-900 rounded-full py-6 shadow-sm">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Review Pending Verifications ({stats.pendingVerification})
                    </Button>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="collectors">
                <Card className="border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 bg-white">
                  <h2 className="text-xl text-gray-900 mb-6">Top Collectors This Month</h2>
                  <div className="space-y-3">
                    {topCollectors.map((collector) => (
                      <div
                        key={collector.rank}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50/50 rounded-xl gap-4 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex items-center justify-center h-12 w-12 rounded-full flex-shrink-0 shadow-sm ${
                              collector.rank === 1
                                ? 'bg-gradient-to-br from-[#FBBF24] to-[#F59E0B]'
                                : collector.rank === 2
                                ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                                : collector.rank === 3
                                ? 'bg-gradient-to-br from-[#fb923c] to-[#f97316]'
                                : 'bg-gray-200'
                            }`}
                          >
                            <span className={collector.rank <= 3 ? 'text-white' : 'text-gray-600'}>
                              #{collector.rank}
                            </span>
                          </div>
                          <div>
                            <div className="text-gray-900 mb-1">{collector.name}</div>
                            <div className="text-sm text-gray-500">
                              {collector.collections} collections • {collector.weight} kg
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg text-gray-900 mb-1">GH₵{collector.earnings.toFixed(2)}</div>
                          <p className="text-sm text-gray-500">Total earned</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 bg-white">
                  <h2 className="text-xl text-gray-900 mb-6">Weekly Performance</h2>
                  <div className="space-y-4 mb-8">
                    {weeklyData.map((day, index) => {
                      const maxWeight = Math.max(...weeklyData.map(d => d.weight));
                      const percentage = (day.weight / maxWeight) * 100;
                      
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-700 w-12">{day.day}</span>
                            <div className="flex-1 mx-4">
                              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] h-2.5 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-right min-w-[120px]">
                              <span className="text-sm text-gray-900">{day.weight} kg</span>
                              <span className="text-sm text-gray-400 ml-2">({day.collections})</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid gap-5 md:grid-cols-3 mb-6">
                    <div className="p-6 bg-gradient-to-br from-[#3b82f6]/5 to-[#3b82f6]/10 rounded-xl border border-[#3b82f6]/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] mb-3 shadow-sm">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-2xl text-gray-900 mb-1">
                        {weeklyData.reduce((sum, d) => sum + d.collections, 0)}
                      </div>
                      <p className="text-sm text-gray-500">Total Collections</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[#10b981]/5 to-[#10b981]/10 rounded-xl border border-[#10b981]/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] mb-3 shadow-sm">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-2xl text-gray-900 mb-1">
                        {weeklyData.reduce((sum, d) => sum + d.weight, 0)} kg
                      </div>
                      <p className="text-sm text-gray-500">Total Weight</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[#8b5cf6]/5 to-[#8b5cf6]/10 rounded-xl border border-[#8b5cf6]/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] mb-3 shadow-sm">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-2xl text-gray-900 mb-1">
                        {Math.round(weeklyData.reduce((sum, d) => sum + d.weight, 0) / weeklyData.length)} kg
                      </div>
                      <p className="text-sm text-gray-500">Daily Average</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => onNavigate('data')}
                    className="w-full bg-[#10b981] hover:bg-[#059669] text-white rounded-full py-6 shadow-sm"
                  >
                    View Detailed Analytics
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
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
            <div className="bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#10b981] rounded-2xl p-8 md:p-12 text-center shadow-lg border border-white/10">
              <h2 className="text-2xl md:text-3xl text-white mb-4">
                Hub Performance Excellence
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Your hub is driving meaningful change. Keep up the excellent management and continue supporting your collectors.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => onNavigate('data')}
                  className="bg-white text-[#3b82f6] hover:bg-gray-50 rounded-full px-8 shadow-sm"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Detailed Analytics
                </Button>
                <Button
                  onClick={() => onNavigate('location-insights')}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#3b82f6] rounded-full px-8"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Health Insights
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
