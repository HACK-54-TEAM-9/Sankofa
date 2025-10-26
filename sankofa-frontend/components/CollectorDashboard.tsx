import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import {
  Package,
  TrendingUp,
  Coins,
  Award,
  MapPin,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
  Heart,
  Users,
  Target,
  Activity,
  Clock,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useCollectorDashboard } from '../hooks/useCollectorDashboard';

interface CollectorDashboardProps {
  onNavigate: (page: string) => void;
}

export function CollectorDashboard({ onNavigate }: CollectorDashboardProps) {
  const { user } = useAuth();
  const { dashboardData, loading, error } = useCollectorDashboard();

  // Mock achievements and goals
  const achievements = [
    { id: 1, name: 'First Collection', icon: '🎯', completed: true },
    { id: 2, name: '10kg Milestone', icon: '🏆', completed: true },
    { id: 3, name: 'Weekly Warrior', icon: '⚡', completed: false },
    { id: 4, name: 'Community Hero', icon: '🌟', completed: false },
  ];

  const recentCollectors = [
    { name: 'Ama Mensah', initials: 'AM', color: 'bg-[#08A26F]' },
    { name: 'Kofi Osei', initials: 'KO', color: 'bg-stone-600' },
    { name: 'Abena Asare', initials: 'AA', color: 'bg-[#FBBF24]' },
    { name: 'Yaw Mensah', initials: 'YM', color: 'bg-stone-500' },
  ];

  const weeklyGoal = 50; // kg
  const currentProgress = dashboardData?.totalKg || 0;
  const progressPercentage = Math.min((currentProgress / weeklyGoal) * 100, 100);

  // Weekly data for chart
  const weeklyData = [
    { day: 'Mon', weight: 3.2 },
    { day: 'Tue', weight: 5.8 },
    { day: 'Wed', weight: 4.1 },
    { day: 'Thu', weight: 6.5 },
    { day: 'Fri', weight: 7.2 },
    { day: 'Sat', weight: 2.8 },
    { day: 'Sun', weight: 1.5 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#08A26F] border-r-transparent"></div>
          <p className="mt-4 text-stone-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left/Center Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Banner */}
            <Card className="bg-[#08A26F] border-0 shadow-lg overflow-hidden">
              <div className="p-8 text-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm">Your Impact</span>
                  </div>
                  <h2 className="text-3xl mb-2 font-bold">
                    {dashboardData?.totalKg || 0} kg Collected
                  </h2>
                  <p className="text-white/90 mb-6">
                    <span className="font-bold">
                      {dashboardData?.totalCollections || 0}
                    </span>{' '}
                    total collections •{' '}
                    <span className="font-bold">
                      GH₵{dashboardData?.earningsGHS?.toFixed(0) || 0}
                    </span>{' '}
                    earned this month
                  </p>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(35,35,35,0.1)] mb-3">
                    <DollarSign className="h-5 w-5 text-[#232323]" />
                  </div>
                  <p className="text-xs text-stone-500 mb-1">
                    Total Earnings
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl text-stone-900">
                      {dashboardData?.earningsGHS?.toFixed(0) || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#232323]">
                    <TrendingUp className="h-3 w-3" />
                    <span>+8.2%</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(35,35,35,0.1)] mb-3">
                    <Award className="h-5 w-5 text-[#232323]" />
                  </div>
                  <p className="text-xs text-stone-500 mb-1">
                    Health Points
                  </p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl text-stone-900">
                      {dashboardData?.healthPoints || 0}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    350 to Level 6
                  </p>
                </div>
              </Card>
            </div>

            {/* Recent Collections */}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg text-stone-900">
                    Recent Collections
                  </h3>
                  <Badge className="bg-[#08A26F]/10 text-[#08A26F] border-0">
                    {dashboardData?.totalCollections || 0} total
                  </Badge>
                </div>

                {dashboardData?.collections && dashboardData.collections.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.collections.slice(0, 4).map((collection: any, index: number) => {
                      const date = collection.timestamp ? new Date(collection.timestamp) : new Date();
                      const now = new Date();
                      const diffMs = now.getTime() - date.getTime();
                      const diffMins = Math.floor(diffMs / 60000);
                      const diffHours = Math.floor(diffMins / 60);

                      let timeAgo = '';
                      if (diffMins < 1) {
                        timeAgo = 'Just now';
                      } else if (diffMins < 60) {
                        timeAgo = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
                      } else if (diffHours < 24) {
                        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                      } else {
                        timeAgo = date.toLocaleDateString();
                      }

                      return (
                        <div
                          key={collection.id || index}
                          className="flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-[#08A26F] text-white">
                                <Package className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm text-stone-900 mb-1">
                                {collection.plasticType || 'Mixed Plastic'}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-stone-500">
                                <span>
                                  {collection.weight || 0} kg
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {timeAgo}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-stone-900 mb-1">
                              GH₵{collection.earnings?.toFixed(2) || '0.00'}
                            </p>
                            <Badge
                              className={
                                collection.status === 'verified'
                                  ? 'bg-[#08A26F]/10 text-[#08A26F] border-0'
                                  : 'bg-[#FBBF24]/10 text-[#FBBF24] border-0'
                              }
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {collection.status || 'pending'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm text-stone-500 mb-2">
                      No collections yet
                    </p>
                    <p className="text-xs text-stone-400">
                      Start collecting to see your history here
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Community Section */}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg text-stone-900">
                    Top Collectors This Week
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#08A26F] hover:text-[#08A26F] hover:bg-[#08A26F]/10 rounded-xl"
                  >
                    View all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {recentCollectors.map((collector, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#FBBF24] text-white shadow-sm">
                          <span className="text-sm">
                            #{index + 1}
                          </span>
                        </div>
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarFallback className={`${collector.color} text-white`}>
                            {collector.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm text-stone-900 mb-1">
                            {collector.name}
                          </p>
                          <p className="text-xs text-stone-500">
                            {Math.floor(Math.random() * 30 + 20)} collections • {Math.floor(Math.random() * 400 + 200)} kg
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-[#08A26F]/10 text-[#08A26F] border-0 text-xs">
                        +{Math.floor(Math.random() * 15 + 5)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Weekly Goal */}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-stone-900">Weekly Goal</h3>
                  <Target className="h-5 w-5 text-[#08A26F]" />
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl text-stone-900">
                      {currentProgress}
                    </span>
                    <span className="text-sm text-stone-500">
                      of {weeklyGoal} kg
                    </span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-3 bg-stone-100"
                  />
                </div>

                <p className="text-sm text-stone-500 mb-4">
                  {weeklyGoal - currentProgress > 0
                    ? `${(weeklyGoal - currentProgress).toFixed(1)} kg remaining`
                    : 'Goal achieved! 🎉'}
                </p>

                <div className="pt-4 border-t border-stone-100">
                  <p className="text-xs text-stone-500 mb-3">
                    Weekly Breakdown
                  </p>
                  <div className="space-y-2">
                    {weeklyData.map((day, index) => {
                      const maxWeight = Math.max(...weeklyData.map((d) => d.weight));
                      const percentage = (day.weight / maxWeight) * 100;

                      return (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-xs text-stone-500 w-8">
                            {day.day}
                          </span>
                          <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#08A26F] h-full rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-stone-500 w-12 text-right">
                            {day.weight} kg
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-stone-900">Achievements</h3>
                  <Award className="h-5 w-5 text-[#FBBF24]" />
                </div>

                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        achievement.completed
                          ? 'bg-[#08A26F]/10 border border-[#08A26F]/20'
                          : 'bg-stone-100 border border-stone-200'
                      }`}
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-stone-900">{achievement.name}</p>
                      </div>
                      {achievement.completed && (
                        <Award className="h-4 w-4 text-[#08A26F]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Health Impact */}
            <Card className="bg-[#08A26F] border-0 shadow-lg">
              <div className="p-6 text-white">
                <Sparkles className="h-8 w-8 mb-4" />
                <h3 className="text-lg mb-2 font-bold">
                  Community Impact
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Your collections helped prevent{' '}
                  {((dashboardData?.totalKg || 0) * 0.5).toFixed(0)} health risks
                  in your neighborhood this month!
                </p>
                <Button
                  onClick={() => onNavigate('location-insights')}
                  variant="secondary"
                  size="sm"
                  className="w-full rounded-xl bg-[rgb(255,255,255)]"
                >
                  View Health Insights
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Quick Action */}
            <Card className="bg-[#FBBF24] border-0 shadow-lg">
              <div className="p-6 text-white">
                <Package className="h-8 w-8 mb-4" />
                <h3 className="text-lg mb-2 text-[rgb(0,0,0)] font-bold">
                  Ready to Collect?
                </h3>
                <p className="text-white/90 text-sm mb-4 text-[rgba(0,0,0,0.9)]">
                  Find your nearest collection hub and start making an impact today
                </p>
                <Button
                  onClick={() => onNavigate('location-insights')}
                  variant="secondary"
                  size="sm"
                  className="w-full rounded-xl bg-[rgb(255,255,255)]"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Collection Hubs
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
