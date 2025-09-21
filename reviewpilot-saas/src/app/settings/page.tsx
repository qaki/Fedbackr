import { getCurrentUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/settings/settings-form"
import RoleManagement from "@/components/settings/RoleManagement"
import AuditLogViewer from "@/components/settings/AuditLogViewer"

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago", 
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Belgrade",
  "Europe/Zagreb",
  "Europe/Sarajevo",
  "Europe/Skopje",
  "Europe/Podgorica",
  "Europe/Pristina",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Australia/Sydney",
  "Australia/Melbourne",
]

const industries = [
  "Restaurant",
  "Retail",
  "Healthcare",
  "Beauty & Wellness",
  "Automotive",
  "Real Estate",
  "Professional Services",
  "Technology",
  "Education",
  "Hospitality",
  "Fitness & Sports",
  "Entertainment",
  "Other"
]

export default async function SettingsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/api/auth/signin")
  }

  // Get user's organization data
  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    include: { organization: true },
  })

  const organization = membership?.organization
  const userRole = membership?.role

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your organization settings and preferences.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
            <SettingsForm 
              initialData={{
                organizationName: organization?.name || "",
                industry: organization?.industry || "",
                timezone: organization?.timezone || "UTC",
              }}
              timezones={timezones}
              industries={industries}
            />
          </div>

          {/* Role Management - Only show for owners */}
          {userRole === "owner" && organization && (
            <RoleManagement 
              organizationId={organization.id}
              currentUserId={user.id}
            />
          )}

          {/* Audit Log - Show for owners and members */}
          {userRole !== "viewer" && organization && (
            <AuditLogViewer organizationId={organization.id} />
          )}
        </div>
      </div>
    </div>
  )
}
