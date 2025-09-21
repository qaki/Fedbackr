"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPITileProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    period: string;
  };
  icon?: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

export default function KPITile({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  color = "blue" 
}: KPITileProps) {
  const colorClasses = {
    blue: "border-blue-500/20 bg-blue-500/10",
    green: "border-green-500/20 bg-green-500/10",
    yellow: "border-yellow-500/20 bg-yellow-500/10",
    red: "border-red-500/20 bg-red-500/10",
    purple: "border-purple-500/20 bg-purple-500/10",
  };

  const textColorClasses = {
    blue: "text-blue-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
    purple: "text-purple-400",
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (trend.value < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (!trend) return "text-gray-400";
    if (trend.value > 0) return "text-green-400";
    if (trend.value < 0) return "text-red-400";
    return "text-gray-400";
  };

  return (
    <Card className={`border ${colorClasses[color]} bg-gray-800/50 backdrop-blur-sm`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          {title}
        </CardTitle>
        {icon && (
          <div className={textColorClasses[color]}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">
              {Math.abs(trend.value)}% vs {trend.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
