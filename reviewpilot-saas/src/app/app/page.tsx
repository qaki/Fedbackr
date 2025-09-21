import { getCurrentUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Building2, Calendar } from "lucide-react"
import Link from "next/link"

export default async function AppPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/api/auth/signin")
  }

  // Get user's organization data
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

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.name || user.email}!
              </h1>
              <p className="text-gray-400">
                Manage your business reputation from one dashboard.
              </p>
              {/* Subscription Status */}
              {subscription ? (
                <div className="mt-2">
                  <Badge 
                    variant={subscription.status === 'active' ? 'default' : 'secondary'}
                    className={subscription.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}
                  >
                    {subscription.status === 'trialing' ? 'Free Trial' : subscription.status}
                  </Badge>
                  {subscription.trialEndsAt && subscription.status === 'trialing' && (
                    <span className="text-gray-400 text-sm ml-2">
                      Trial ends {new Date(subscription.trialEndsAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    No Subscription
                  </Badge>
                </div>
              )}
            </div>
            <Link href="/settings">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Organization Info */}
        {organization ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-cyan-400" />
                  Organization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white font-semibold">{organization.name}</p>
                <p className="text-gray-400 text-sm">{organization.industry}</p>
                <Badge variant="secondary" className="mt-2">
                  {membership?.role}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-green-400" />
                  Timezone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white font-semibold">{organization.timezone}</p>
                <p className="text-gray-400 text-sm">
                  {new Date().toLocaleString('en-US', { 
                    timeZone: organization.timezone,
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <User className="mr-2 h-5 w-5 text-purple-400" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white font-semibold">{user.name || 'No name set'}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <Badge variant="outline" className="mt-2">
                  Active
                </Badge>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Setup Required</CardTitle>
              <CardDescription className="text-gray-400">
                Complete your organization setup to start managing your reviews.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings">
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-black">
                  Complete Setup
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Link href="/reviews">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Reviews</CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor all your reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-cyan-400">0</p>
                <p className="text-gray-400 text-sm">Total reviews</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Reports</CardTitle>
                <CardDescription className="text-gray-400">
                  Analytics & exports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-400">📊</p>
                <p className="text-gray-400 text-sm">View reports</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">AI Responses</CardTitle>
              <CardDescription className="text-gray-400">
                Generated responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">0</p>
              <p className="text-gray-400 text-sm">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Alerts</CardTitle>
              <CardDescription className="text-gray-400">
                Notifications sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-400">0</p>
              <p className="text-gray-400 text-sm">This week</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Locations</CardTitle>
              <CardDescription className="text-gray-400">
                Business locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-400">0</p>
              <p className="text-gray-400 text-sm">Connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 border-cyan-500/20 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Getting Started</CardTitle>
            <CardDescription className="text-gray-400">
              Set up your account to start monitoring and managing your reviews.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-black text-sm font-bold">1</span>
                </div>
                <span className="text-white">Complete your organization setup</span>
                <Link href="/settings">
                  <Button variant="outline" size="sm" className="ml-auto">
                    Go to Settings
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-300 text-sm font-bold">2</span>
                </div>
                <span className="text-gray-400">Connect your business accounts</span>
                <Button variant="outline" size="sm" className="ml-auto" disabled>
                  Coming Soon
                </Button>
              </div>
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
      </div>
    </div>
  )
}