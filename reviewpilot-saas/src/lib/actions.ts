"use server"

import { z } from "zod"
import { prisma } from "./prisma"
import { getCurrentUser } from "./auth-server"
import { revalidatePath } from "next/cache"

const settingsSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required").max(100),
  industry: z.string().min(1, "Industry is required").max(100),
  timezone: z.string().min(1, "Timezone is required"),
})

export type SettingsFormData = z.infer<typeof settingsSchema>

export async function updateSettingsAction(formData: SettingsFormData) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      throw new Error("Unauthorized")
    }

    // Validate the form data
    const validatedData = settingsSchema.parse(formData)

    // Check if user has an existing organization
    const existingMembership = await prisma.membership.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    })

    if (existingMembership) {
      // Update existing organization
      await prisma.organization.update({
        where: { id: existingMembership.organizationId },
        data: {
          name: validatedData.organizationName,
          industry: validatedData.industry,
          timezone: validatedData.timezone,
        },
      })
    } else {
      // Create new organization and membership
      const organization = await prisma.organization.create({
        data: {
          name: validatedData.organizationName,
          industry: validatedData.industry,
          timezone: validatedData.timezone,
        },
      })

      await prisma.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "owner",
        },
      })
    }

    revalidatePath("/settings")
    return { success: true, message: "Settings updated successfully!" }
  } catch (error) {
    console.error("Error updating settings:", error)
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: "Validation error", 
        errors: error.flatten().fieldErrors 
      }
    }
    return { 
      success: false, 
      message: "Failed to update settings. Please try again." 
    }
  }
}
