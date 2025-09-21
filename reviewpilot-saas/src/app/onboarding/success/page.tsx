import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Calendar, CreditCard, Settings } from "lucide-react"
import { CompleteSetupButton } from "@/components/CompleteSetupButton"
import Link from "next/link"

interface SuccessPageProps {
  searchParams: {
    checkout?: string
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/api/auth/signin")
  }

  // Get user's organization and subscription
  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    include: { 
      organization: {
        include: {
          subscriptions: true
        }
      } 
    },
  })

  const organization = membership?.organization
  const subscription = organization?.subscriptions?.[0]

  const isCheckoutSuccess = searchParams.checkout === 'success'

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            {isCheckoutSuccess ? "Welcome to ReviewPilot Pro!" : "Setup Complete!"}
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {isCheckoutSuccess 
              ? "Your subscription is now active. Start managing your reviews with AI-powered responses."
              : "Your account is ready. Complete your setup to start managing your reviews."
            }
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Account Status */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-semibold">{user.name || 'No name set'}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                Active
              </Badge>
            </CardContent>
          </Card>

          {/* Organization Status */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-semibold">{organization?.name || 'Not set'}</p>
              <p className="text-gray-400 text-sm">{organization?.industry || 'No industry'}</p>
              <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                {organization ? 'Configured' : 'Setup Required'}
              </Badge>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center">
                {subscription?.status === 'active' || subscription?.status === 'trialing' ? (
                  <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                ) : (
                  <CreditCard className="mr-2 h-5 w-5 text-yellow-400" />
                )}
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-semibold">
                {subscription?.status === 'trialing' ? 'Free Trial' : 
                 subscription?.status === 'active' ? 'Pro Plan' : 'No Subscription'}
              </p>
              <p className="text-gray-400 text-sm">
                {subscription?.trialEndsAt ? 
                  `Trial ends ${new Date(subscription.trialEndsAt).toLocaleDateString()}` :
                  subscription?.currentPeriodEnd ?
                  `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` :
                  '$39.99/month'
                }
              </p>
              <Badge 
                variant="outline" 
                className={`mt-2 ${
                  subscription?.status === 'active' || subscription?.status === 'trialing' 
                    ? 'text-green-400 border-green-400' 
                    : 'text-yellow-400 border-yellow-400'
                }`}
              >
                {subscription?.status || 'Inactive'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 border-cyan-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Next Steps</CardTitle>
            <CardDescription className="text-gray-400">
              Complete your setup to start managing your reviews effectively.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Step 1: Organization Setup */}
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  organization ? 'bg-green-500' : 'bg-cyan-500'
                }`}>
                  {organization ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-white text-sm font-bold">1</span>
                  )}
                </div>
                <span className={`${organization ? 'text-green-400' : 'text-white'}`}>
                  Complete organization setup
                </span>
                <Link href="/settings">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto"
                    disabled={!!organization}
                  >
                    {organization ? 'Completed' : 'Setup Now'}
                  </Button>
                </Link>
              </div>

              {/* Step 2: Connect Business Accounts */}
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-300 text-sm font-bold">2</span>
                </div>
                <span className="text-gray-400">Connect your business accounts</span>
                <Button variant="outline" size="sm" className="ml-auto" disabled>
                  Coming Soon
                </Button>
              </div>

              {/* Step 3: Start Monitoring */}
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-300 text-sm font-bold">3</span>
                </div>
                <span className="text-gray-400">Start monitoring reviews</span>
                <Button variant="outline" size="sm" className="ml-auto" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CompleteSetupButton className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-8 py-3 rounded-lg group">
            Complete Setup
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </CompleteSetupButton>
          
          <Link href="/app">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 rounded-lg group">
              <Settings className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Trial Information */}
        {subscription?.status === 'trialing' && (
          <Card className="bg-yellow-500/10 border-yellow-500/20 mt-8">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Free Trial Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Your 7-day free trial is now active! You have full access to all Pro features. 
                Your subscription will automatically renew on{' '}
                <span className="text-white font-semibold">
                  {new Date(subscription.trialEndsAt!).toLocaleDateString()}
                </span>
                .
              </p>
              <p className="text-gray-400 text-sm mt-2">
                You can cancel anytime from your dashboard settings.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
