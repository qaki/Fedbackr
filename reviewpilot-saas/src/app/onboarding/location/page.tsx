"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building, CheckCircle, AlertCircle } from "lucide-react";

type Item = { id: string; displayName: string; address?: string };

export default function SelectLocationPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Item | null>(null);
  const [isAttaching, setIsAttaching] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/google/locations");
        const data = await res.json();
        if (data?.needsConnect) {
          window.location.href = "/onboarding/connect";
          return;
        }
        setItems(data?.items || []);
      } catch (e: any) {
        setError("Failed to load locations.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const select = async (item: Item) => {
    setIsAttaching(true);
    setSelectedLocation(item);
    
    try {
      const res = await fetch("/api/locations/attach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ externalId: item.id, name: item.displayName }),
      });
      if (!res.ok) throw new Error("Attach failed");
      // go to next step
      window.location.href = "/onboarding/alerts";
    } catch {
      alert("Could not attach this location. Try again.");
    } finally {
      setIsAttaching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading your locations...</h2>
          <p className="text-gray-400">Fetching your Google Business Profile locations</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Locations</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Select Your Business Location</h1>
          <p className="text-gray-400">
            Choose the Google Business Profile location you want to manage reviews for.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 h-1 bg-green-500 rounded"></div>
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-bold">2</span>
            </div>
            <div className="flex-1 h-1 bg-gray-700 rounded">
              <div className="h-1 bg-cyan-500 rounded w-1/3"></div>
            </div>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-300 text-sm font-bold">3</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span className="text-green-400">Connect Google</span>
            <span className="text-cyan-400">Select Location</span>
            <span>Set Alerts</span>
          </div>
        </div>

        {/* Locations List */}
        {items.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Locations Found</h3>
              <p className="text-gray-400 mb-4">
                We couldn't find any Google Business Profile locations for your account.
              </p>
              <p className="text-gray-500 text-sm">
                Make sure your Google account has manager or owner access to a Business Profile.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-6">
              Choose from {items.length} location{items.length !== 1 ? 's' : ''}:
            </h2>
            
            {items.map((item) => (
              <Card key={item.id} className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3">
                          <MapPin className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.displayName}</h3>
                        </div>
                      </div>
                      
                      <div className="ml-13 space-y-2">
                        {item.address && <p className="text-gray-300">{item.address}</p>}
                        <p className="text-gray-500 text-xs font-mono">{item.id}</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => select(item)}
                      disabled={isAttaching && selectedLocation?.id === item.id}
                      className="ml-6 bg-cyan-500 hover:bg-cyan-400 text-black"
                    >
                      {isAttaching && selectedLocation?.id === item.id ? (
                        <>
                          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Selecting...
                        </>
                      ) : (
                        'Select'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Text */}
        <Card className="mt-12 bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <h3 className="text-blue-400 font-semibold mb-2">Need Help?</h3>
            <p className="text-gray-300 text-sm">
              If you don't see your business location, make sure you have manager or owner access 
              to the Google Business Profile. You can request access from the current owner.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
