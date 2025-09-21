"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateSettingsAction, SettingsFormData } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"

const settingsSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required").max(100),
  industry: z.string().min(1, "Industry is required"),
  timezone: z.string().min(1, "Timezone is required"),
})

interface SettingsFormProps {
  initialData: SettingsFormData
  timezones: string[]
  industries: string[]
}

export function SettingsForm({ initialData, timezones, industries }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const result = await updateSettingsAction(data)
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message })
      } else {
        setSubmitStatus({ type: 'error', message: result.message })
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'An unexpected error occurred. Please try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Organization Information</CardTitle>
          <CardDescription className="text-gray-400">
            Update your organization details and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-white">
              Organization Name *
            </Label>
            <Input
              id="organizationName"
              {...register("organizationName")}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter your organization name"
            />
            {errors.organizationName && (
              <p className="text-red-400 text-sm">{errors.organizationName.message}</p>
            )}
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-white">
              Industry *
            </Label>
            <select
              id="industry"
              {...register("industry")}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="">Select your industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="text-red-400 text-sm">{errors.industry.message}</p>
            )}
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-white">
              Timezone *
            </Label>
            <select
              id="timezone"
              {...register("timezone")}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500 focus:outline-none"
            >
              {timezones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
            {errors.timezone && (
              <p className="text-red-400 text-sm">{errors.timezone.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Status */}
      {submitStatus.type && (
        <div className={`p-4 rounded-lg border ${
          submitStatus.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex items-center space-x-2">
            {submitStatus.type === 'success' ? (
              <Check className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4 rounded-full bg-red-400" />
            )}
            <span className="text-sm">{submitStatus.message}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-8 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </form>
  )
}
