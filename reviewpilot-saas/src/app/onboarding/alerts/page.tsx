"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Bell, Mail, Smartphone } from "lucide-react";

export default function OnboardingAlertsPage() {
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)
  const [locationId, setLocationId] = useState<string | null>(null)
  const [alertSettings, setAlertSettings] = useState({
    channelEmail: true,
    channelWhatsApp: false,
    whatsappNumber: "",
    starThreshold: 3,
    frequency: "instant" as "instant" | "daily",
  })

  useEffect(() => {
    (async () => {
      try {
        // First get the current location
        const locationRes = await fetch('/api/locations/current')
        const locationData = await locationRes.json()
        
        if (locationData?.location?.id) {
          setLocationId(locationData.location.id)
          
          // Then get alert preferences for this location
          const res = await fetch(`/api/alerts/prefs?locationId=${locationData.location.id}`)
          const data = await res.json()
          if (data?.pref) {
            setAlertSettings(prev => ({
              ...prev,
              channelEmail: data.pref.channelEmail ?? true,
              channelWhatsApp: data.pref.channelWhatsApp ?? false,
              whatsappNumber: data.pref.whatsappNumber ?? "",
              starThreshold: data.pref.starThreshold ?? 3,
              frequency: (data.pref.frequency ?? 'instant') as 'instant' | 'daily',
            }))
          }
        }
      } catch (e) {
        console.error('Load prefs error', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSaveSettings = async () => {
    if (!locationId) {
      alert('Location not found. Please try again.')
      return
    }
    
    setIsSaving(true)
    try {
      const res = await fetch(`/api/alerts/prefs?locationId=${locationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertSettings),
      })
      if (!res.ok) throw new Error('Save failed')
      window.location.href = '/app'
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendTest = async () => {
    if (!locationId) {
      alert('Location not found. Please try again.')
      return
    }
    
    setSendingTest(true)
    try {
      const res = await fetch(`/api/alerts/test?locationId=${locationId}`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Test failed')
      alert(`Test sent to your channels (sent=${data.sent}).`)
    } catch (e) {
      console.error('Test alert error', e)
      alert('Failed to send test alert.')
    } finally {
      setSendingTest(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Set Up Review Alerts</h1>
          <p className="text-gray-400">
            Choose how you want to be notified when new reviews are posted.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 h-1 bg-green-500 rounded"></div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 h-1 bg-green-500 rounded"></div>
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-bold">3</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span className="text-green-400">Connect Google</span>
            <span className="text-green-400">Select Location</span>
            <span className="text-cyan-400">Set Alerts</span>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="space-y-8">
          {/* Notification Methods */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="mr-3 h-5 w-5 text-cyan-400" />
                Notification Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-white font-medium">Email Notifications</h3>
                    <p className="text-gray-400 text-sm">Get alerts sent to your email address</p>
                  </div>
                </div>
                <Checkbox
                  checked={alertSettings.channelEmail}
                  onCheckedChange={(checked) => setAlertSettings(prev => ({ ...prev, channelEmail: !!checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-white font-medium">WhatsApp Notifications</h3>
                    <p className="text-gray-400 text-sm">Get alerts via WhatsApp to your number</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="tel"
                    placeholder="e.g. +15551234567"
                    value={alertSettings.whatsappNumber}
                    onChange={(e) => setAlertSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-gray-200 placeholder-gray-500"
                  />
                  <Checkbox
                    checked={alertSettings.channelWhatsApp}
                    onCheckedChange={(checked) => setAlertSettings(prev => ({ ...prev, channelWhatsApp: !!checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Types */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Alert Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">New Reviews</h3>
                  <p className="text-gray-400 text-sm">Get notified when any new review is posted</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">Notify when rating ≤</span>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={alertSettings.starThreshold}
                    onChange={(e) => setAlertSettings(prev => ({ ...prev, starThreshold: Number(e.target.value) }))}
                    className="w-20 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Frequency</h3>
                  <p className="text-gray-400 text-sm">Instant alerts. Daily digests coming soon.</p>
                </div>
                <select
                  value={alertSettings.frequency}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, frequency: e.target.value as 'instant' | 'daily' }))}
                  className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
                  disabled
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily (soon)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button
            onClick={handleSendTest}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
            disabled={sendingTest}
          >
            {sendingTest ? 'Sending Test...' : 'Send Test Alert'}
          </Button>
          
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSaving ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                Complete Setup
                <CheckCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </>
            )}
          </Button>
        </div>

        {/* Success Message */}
        <Card className="mt-8 bg-green-500/10 border-green-500/20">
          <CardContent className="p-6">
            <h3 className="text-green-400 font-semibold mb-2">Setup Almost Complete!</h3>
            <p className="text-gray-300 text-sm">
              Once you save these settings, you'll be redirected to your dashboard where you can start 
              monitoring and responding to reviews with AI assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
