"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RatingChartProps {
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
}

export default function RatingChart({ ratingDistribution, totalReviews }: RatingChartProps) {
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  const getBarColor = (rating: number) => {
    switch (rating) {
      case 5:
        return "bg-green-500";
      case 4:
        return "bg-blue-500";
      case 3:
        return "bg-yellow-500";
      case 2:
        return "bg-orange-500";
      case 1:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const ratings = [5, 4, 3, 2, 1];

  return (
    <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Rating Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ratings.map((rating) => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution];
            const percentage = getPercentage(count);
            
            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center w-8">
                  <span className="text-sm font-medium text-gray-300">
                    {rating}★
                  </span>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getBarColor(rating)} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-20">
                  <span className="text-sm text-gray-400">
                    {count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Total Reviews: {totalReviews}</span>
            <span>
              Avg: {totalReviews > 0 
                ? (Object.entries(ratingDistribution)
                    .reduce((sum, [rating, count]) => sum + (parseInt(rating) * count), 0) / totalReviews)
                    .toFixed(1)
                : "0.0"
              }★
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
