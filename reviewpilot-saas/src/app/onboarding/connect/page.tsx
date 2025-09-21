"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

export default function ConnectGooglePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/google/oauth/start");
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Failed to start OAuth");
      window.location.href = data.url;
    } catch (e: any) {
      setError("Could not start Google connection. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Connect Google Business</h1>
          <p className="text-gray-400">
            Connect your Google Business Profile account to fetch locations and manage reviews.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-bold">1</span>
            </div>
            <div className="flex-1 h-1 bg-gray-700 rounded">
              <div className="h-1 bg-cyan-500 rounded w-1/3"></div>
            </div>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-300 text-sm font-bold">2</span>
            </div>
            <div className="flex-1 h-1 bg-gray-700 rounded">
              <div className="h-1 bg-gray-700 rounded"></div>
            </div>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-300 text-sm font-bold">3</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span className="text-cyan-400">Connect Google</span>
            <span>Select Location</span>
            <span>Set Alerts</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-red-400 font-semibold">Connection Error</h3>
                <p className="text-gray-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Connection Card */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Connect Your Google Business Profile</CardTitle>
            <CardDescription className="text-gray-400">
              We'll help you connect your Google Business Profile account so we can monitor your reviews 
              and help you respond to them automatically with AI assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              
              <Button
                onClick={connect}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-400 text-white font-medium px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Opening Google...
                  </>
                ) : (
                  <>
                    Connect Google Business
                    <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <p className="text-gray-500 text-sm mt-4">
                You'll be redirected to Google to authorize the connection
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Automatic Review Monitoring</h3>
            <p className="text-gray-400 text-sm">We'll automatically detect new reviews from your Google Business Profile account</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Instant Alerts</h3>
            <p className="text-gray-400 text-sm">Get notified immediately when new reviews are posted</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">AI-Powered Responses</h3>
            <p className="text-gray-400 text-sm">Generate professional responses to reviews with AI assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
