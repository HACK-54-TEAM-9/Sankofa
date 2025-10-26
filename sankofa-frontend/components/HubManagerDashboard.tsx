import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import {
  Building2,
  Users,
  User,
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
  ChevronRight,
  Plus,
  Phone,
  Target,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { useHubDashboard } from "../hooks/useHubDashboard";

interface HubManagerDashboardProps {
  onNavigate: (page: string) => void;
}

export function HubManagerDashboard({
  onNavigate,
}: HubManagerDashboardProps) {
  const { user } = useAuth();
  const { dashboardData, loading, error } = useHubDashboard();

  // Merge real data with defaults
  const stats = {
    hubName: "Accra Central Hub",
    totalCollectors:
      dashboardData?.totalRegisteredCollectors || 0,
    totalTransactions: dashboardData?.totalTransactions || 0,
    totalKgCollected: dashboardData?.totalKgCollected || 0,
    activeToday: 34,
    plasticProcessed: dashboardData?.totalKgProcessed || 0,
    monthlyRevenue: 1728.0,
    pendingVerification: 5,
    collectionsToday: 23,
  };

  const topCollectors = [
    {
      name: "Ama Mensah",
      initials: "AM",
      collections: 45,
      weight: 567,
      earnings: 283.5,
      trend: "+12%",
      color: "bg-[#08A26F]",
    },
    {
      name: "Kofi Osei",
      initials: "KO",
      collections: 42,
      weight: 523,
      earnings: 261.5,
      trend: "+8%",
      color: "bg-stone-600",
    },
    {
      name: "Abena Asare",
      initials: "AA",
      collections: 38,
      weight: 489,
      earnings: 244.5,
      trend: "+15%",
      color: "bg-[#FBBF24]",
    },
    {
      name: "Yaw Mensah",
      initials: "YM",
      collections: 35,
      weight: 445,
      earnings: 222.5,
      trend: "+5%",
      color: "bg-stone-500",
    },
  ];

  // Get recent transactions from dashboard data
  const recentTransactions = (dashboardData?.transactions || [])
    .slice(0, 5)
    .map((txn: any) => {
      const date = new Date(txn.timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      let timeAgo = "";
      if (diffMins < 1) {
        timeAgo = "Just now";
      } else if (diffMins < 60) {
        timeAgo = `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else {
        timeAgo = date.toLocaleDateString();
      }

      const collectorName = txn.collectorName || "Unknown";
      const initials = collectorName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

      // Generate a consistent color based on collector name
      const colors = [
        "bg-[#08A26F]",
        "bg-stone-600",
        "bg-[#FBBF24]",
        "bg-stone-500",
      ];
      const colorIndex = collectorName.length % colors.length;

      return {
        id: txn.id,
        time: timeAgo,
        collector: collectorName,
        initials,
        plasticType: txn.plasticType,
        weight: txn.weight,
        instantCash: txn.instantCash,
        status: txn.status || "completed",
        color: colors[colorIndex],
      };
    });

  const weeklyData = [
    { day: "Mon", collections: 45, weight: 567 },
    { day: "Tue", collections: 52, weight: 643 },
    { day: "Wed", collections: 48, weight: 592 },
    { day: "Thu", collections: 56, weight: 698 },
    { day: "Fri", collections: 61, weight: 756 },
    { day: "Sat", collections: 38, weight: 471 },
    { day: "Sun", collections: 23, weight: 289 },
  ];

  const monthlyTarget = 5000; // kg
  const currentProgress = stats.plasticProcessed;
  const progressPercentage =
    (currentProgress / monthlyTarget) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#08A26F] border-r-transparent"></div>
          <p className="mt-4 text-stone-600">
            Loading hub dashboard...
          </p>
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
            <Card className="bg-[#08A26F] border border-black/[0.15] shadow-lg overflow-hidden">
              <div className="p-8 text-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">
                      Sales & Performance
                    </span>
                  </div>
                  <h2 className="text-3xl mb-2 font-bold">
                    {stats.totalTransactions.toLocaleString()}{" "}
                    Total Transactions
                  </h2>
                  <p className="text-white/90 mb-6">
                    <span className="font-bold">
                      {stats.totalKgCollected.toLocaleString()}
                    </span>{" "}
                    kg of plastic collected •{" "}
                    <span className="font-bold">
                      {stats.totalCollectors}
                    </span>{" "}
                    collectors registered
                  </p>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white border border-black/[0.15] shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBBF24]/10 mb-3 bg-[rgba(35,35,35,0.1)]">
                    <DollarSign className="h-5 w-5 text-[#232323]" />
                  </div>
                  <p className="text-xs text-stone-500 mb-1">
                    Revenue
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl text-stone-900">
                      {stats.monthlyRevenue.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#232323]">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12%</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-black/[0.15] shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBBF24]/10 mb-3 bg-[rgba(35,35,35,0.1)]">
                    <Clock className="h-5 w-5 text-[#232323]" />
                  </div>
                  <p className="text-xs text-stone-500 mb-1">
                    Pending
                  </p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl text-stone-900">
                      {stats.pendingVerification}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Need review
                  </p>
                </div>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="bg-white border border-black/[0.15] shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg text-stone-900">
                    Recent Transactions
                  </h3>
                  <Badge className="bg-[#08A26F]/10 text-[#08A26F] border-0">
                    {stats.totalTransactions} total
                  </Badge>
                </div>

                {recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarFallback
                              className={`${transaction.color} text-white`}
                            >
                              {transaction.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm text-stone-900 mb-1">
                              {transaction.collector}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-stone-500">
                              <span>
                                {transaction.weight} kg •{" "}
                                {transaction.plasticType}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {transaction.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-stone-900 mb-1">
                            GH₵
                            {transaction.instantCash.toFixed(2)}
                          </p>
                          <Badge className="bg-[#08A26F]/10 text-[#08A26F] border-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm text-stone-500 mb-2">
                      No transactions yet
                    </p>
                    <p className="text-xs text-stone-400">
                      Start processing collections to see them
                      here
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Top Collectors */}
            <Card className="bg-white border border-black/[0.15] shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg text-stone-900">
                    Top Collectors This Month
                  </h3>
                  {topCollectors.length > 0 && (
                    <Button
                      onClick={() =>
                        onNavigate("view-collectors")
                      }
                      variant="ghost"
                      size="sm"
                      className="text-[#08A26F] hover:text-[#08A26F] hover:bg-[#08A26F]/10 rounded-xl"
                    >
                      View all
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>

                {topCollectors.length > 0 ? (
                  <div className="space-y-3">
                    {topCollectors.map((collector, index) => (
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
                            <AvatarFallback
                              className={`${collector.color} text-white`}
                            >
                              {collector.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm text-stone-900 mb-1">
                              {collector.name}
                            </p>
                            <p className="text-xs text-stone-500">
                              {collector.collections}{" "}
                              collections • {collector.weight}{" "}
                              kg
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-stone-900 mb-1">
                            GH₵{collector.earnings.toFixed(2)}
                          </p>
                          <Badge className="bg-[#08A26F]/10 text-[#08A26F] border-0 text-xs">
                            {collector.trend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm text-stone-500 mb-2">
                      No collectors yet
                    </p>
                    <p className="text-xs text-stone-400 mb-4">
                      Register collectors to see top performers
                      here
                    </p>
                    <Button
                      onClick={() =>
                        onNavigate("register-collector")
                      }
                      size="sm"
                      className="bg-[#08A26F] hover:bg-[#08A26F]/90 text-white rounded-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Register Collector
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Monthly Target */}
            <Card className="bg-white border border-black/[0.15] shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-stone-900">
                    Monthly Target
                  </h3>
                  <Target className="h-5 w-5 text-[#08A26F]" />
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl text-stone-900">
                      {currentProgress}
                    </span>
                    <span className="text-sm text-stone-500">
                      of {monthlyTarget} kg
                    </span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-3 bg-stone-100"
                  />
                </div>

                <p className="text-sm text-stone-500 mb-4">
                  {monthlyTarget - currentProgress > 0
                    ? `${(monthlyTarget - currentProgress).toLocaleString()} kg remaining`
                    : "Target achieved! 🎉"}
                </p>

                <div className="pt-4 border-t border-black/[0.15]">
                  <p className="text-xs text-stone-500 mb-3">
                    Weekly Breakdown
                  </p>
                  <div className="space-y-2">
                    {weeklyData.map((day, index) => {
                      const maxWeight = Math.max(
                        ...weeklyData.map((d) => d.weight),
                      );
                      const percentage =
                        (day.weight / maxWeight) * 100;

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3"
                        >
                          <span className="text-xs text-stone-500 w-8">
                            {day.day}
                          </span>
                          <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#08A26F] h-full rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                              }}
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

            {/* Hub Insights */}
            <Card className="bg-white border border-black/[0.15] shadow-sm">
              <div className="p-6">
                <h3 className="text-lg text-stone-900 mb-4">
                  Hub Insights
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#08A26F]/10 rounded-xl border border-black/[0.15]">
                    <div>
                      <p className="text-sm text-stone-900 mb-1">
                        Avg. Collection
                      </p>
                      <p className="text-xs text-stone-500">
                        Per collector
                      </p>
                    </div>
                    <span className="text-2xl text-stone-900">
                      {(
                        stats.plasticProcessed /
                        stats.totalCollectors
                      ).toFixed(1)}{" "}
                      kg
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#FBBF24]/10 rounded-xl border border-black/[0.15]">
                    <div>
                      <p className="text-sm text-stone-900 mb-1">
                        Processing Rate
                      </p>
                      <p className="text-xs text-stone-500">
                        Collections/day
                      </p>
                    </div>
                    <span className="text-2xl text-stone-900">
                      {(
                        weeklyData.reduce(
                          (sum, d) => sum + d.collections,
                          0,
                        ) / 7
                      ).toFixed(0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-stone-100 rounded-xl border border-black/[0.15]">
                    <div>
                      <p className="text-sm text-stone-900 mb-1">
                        Commission
                      </p>
                      <p className="text-xs text-stone-500">
                        This month
                      </p>
                    </div>
                    <span className="text-2xl text-stone-900">
                      GH₵
                      {(stats.monthlyRevenue * 0.05).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#08A26F] border border-black/[0.15] shadow-lg">
              <div className="p-6 text-white">
                <Sparkles className="h-8 w-8 mb-4" />
                <h3 className="text-lg mb-2 font-bold">
                  Hub Performance
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Your hub is in the top 10% for processing
                  efficiency this month!
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onNavigate("data")}
                    size="sm"
                    className="flex-1 rounded-xl bg-white hover:bg-stone-50 text-stone-900 border-0 shadow-sm"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button
                    onClick={() =>
                      onNavigate("location-insights")
                    }
                    size="sm"
                    className="flex-1 rounded-xl bg-white hover:bg-stone-50 text-stone-900 border-0 shadow-sm"
                  >
                    Insights
                  </Button>
                </div>
              </div>
            </Card>

            {/* Register Collectors */}
            <Card className="bg-[#FBBF24] border border-black/[0.15] shadow-lg">
              <div className="p-6 text-white">
                <User className="h-8 w-8 mb-4" />
                <h3 className="text-lg mb-2 text-[rgb(0,0,0)] font-bold">
                  Register Illiterate Collectors
                </h3>
                <p className="text-white/90 text-sm mb-4 text-[rgba(0,0,0,0.9)]">
                  Use our guided flow to register collectors who
                  can't read or don't have smartphones
                </p>
                <Button
                  onClick={() =>
                    onNavigate("register-collector")
                  }
                  size="sm"
                  className="w-full rounded-xl bg-white hover:bg-stone-50 text-stone-900 border-0 shadow-sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Register New Collector
                </Button>
              </div>
            </Card>

            {/* Support */}
            <Card className="bg-white border border-black/[0.15] shadow-sm">
              <div className="p-6">
                <h3 className="text-lg text-stone-900 mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl border-black/[0.15]"
                    onClick={() => onNavigate("messaging")}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl border-black/[0.15]"
                    onClick={() => onNavigate("about")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Training Resources
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
