"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KPITile from "@/components/reports/KPITile";
import ExportButton from "@/components/reports/ExportButton";
import RatingChart from "@/components/reports/RatingChart";
import { 
  Star, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Calendar,
  Download,
  BarChart3,
  FileText,
  Database
} from "lucide-react";

interface KPIData {
  period: number;
  totalReviews: number;
  newReviews: number;
  avgRating: number;
  responseRate: number;
  medianResponseTime: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recentReviews: number;
  repliedReviews: number;
  unrepliedReviews: number;
}

export default function ReportsClient() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [comparisonData, setComparisonData] = useState<KPIData | null>(null);

  const fetchKPIs = async (days: number) => {
    try {
      const response = await fetch(`/api/reports/kpis?days=${days}`);
      const data = await response.json();
      if (response.ok) {
        setKpiData(data);
      } else {
        console.error("Failed to fetch KPIs:", data.error);
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    }
  };

  const fetchComparisonData = async (days: number) => {
    try {
      // Fetch data for comparison period (previous period of same length)
      const response = await fetch(`/api/reports/kpis?days=${days * 2}`);
      const data = await response.json();
      if (response.ok) {
        setComparisonData(data);
      }
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const days = parseInt(selectedPeriod);
      await Promise.all([
        fetchKPIs(days),
        fetchComparisonData(days),
      ]);
      setLoading(false);
    };

    loadData();
  }, [selectedPeriod]);

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const getTrendData = (currentValue: number, field: keyof KPIData) => {
    if (!comparisonData || !kpiData) return undefined;
    
    const previousValue = comparisonData[field] as number;
    const trend = calculateTrend(currentValue, previousValue);
    
    return {
      value: Math.round(trend),
      period: `previous ${selectedPeriod} days`,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!kpiData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Failed to load report data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="text-gray-300">Report Period:</span>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex space-x-2">
          <ExportButton type="reviews" days={parseInt(selectedPeriod)} />
          <ExportButton type="replies" days={parseInt(selectedPeriod)} />
          <ExportButton type="both" days={parseInt(selectedPeriod)} />
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPITile
          title="Total Reviews"
          value={kpiData.totalReviews}
          subtitle={`${kpiData.newReviews} new this period`}
          trend={getTrendData(kpiData.totalReviews, 'totalReviews')}
          icon={<MessageSquare className="h-5 w-5" />}
          color="blue"
        />
        
        <KPITile
          title="Average Rating"
          value={`${kpiData.avgRating}★`}
          subtitle="Overall rating"
          trend={getTrendData(kpiData.avgRating, 'avgRating')}
          icon={<Star className="h-5 w-5" />}
          color="yellow"
        />
        
        <KPITile
          title="Response Rate"
          value={`${kpiData.responseRate}%`}
          subtitle={`${kpiData.repliedReviews} of ${kpiData.totalReviews} replied`}
          trend={getTrendData(kpiData.responseRate, 'responseRate')}
          icon={<TrendingUp className="h-5 w-5" />}
          color="green"
        />
        
        <KPITile
          title="Response Time"
          value={`${kpiData.medianResponseTime}h`}
          subtitle="Median response time"
          trend={getTrendData(kpiData.medianResponseTime, 'medianResponseTime')}
          icon={<Clock className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Charts and Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingChart 
          ratingDistribution={kpiData.ratingDistribution}
          totalReviews={kpiData.totalReviews}
        />
        
        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Recent Reviews (7 days)</span>
                <span className="text-white font-semibold">{kpiData.recentReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Replied Reviews</span>
                <span className="text-green-400 font-semibold">{kpiData.repliedReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Unreplied Reviews</span>
                <span className="text-red-400 font-semibold">{kpiData.unrepliedReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">New Reviews This Period</span>
                <span className="text-blue-400 font-semibold">{kpiData.newReviews}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Data Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-600 rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <h3 className="font-semibold text-white mb-1">Reviews Export</h3>
              <p className="text-sm text-gray-400 mb-3">
                Export all reviews with ratings, dates, and response status
              </p>
              <ExportButton type="reviews" days={parseInt(selectedPeriod)} />
            </div>
            
            <div className="text-center p-4 border border-gray-600 rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <h3 className="font-semibold text-white mb-1">Replies Export</h3>
              <p className="text-sm text-gray-400 mb-3">
                Export all posted replies with response times
              </p>
              <ExportButton type="replies" days={parseInt(selectedPeriod)} />
            </div>
            
            <div className="text-center p-4 border border-gray-600 rounded-lg">
              <Database className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-semibold text-white mb-1">Complete Export</h3>
              <p className="text-sm text-gray-400 mb-3">
                Export both reviews and replies in one file
              </p>
              <ExportButton type="both" days={parseInt(selectedPeriod)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
