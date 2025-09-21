import { prisma } from '@/lib/prisma';

export interface AuditLogData {
  organizationId: string;
  userId?: string;
  action: string;
  targetId?: string;
  metadata?: Record<string, any>;
}

export async function logAuditEvent(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: data.organizationId,
        userId: data.userId,
        action: data.action,
        targetId: data.targetId,
        metadata: data.metadata || {},
      },
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw - audit logging should not break the main flow
  }
}

// Predefined audit actions
export const AuditActions = {
  // Review actions
  REVIEW_REPLIED: 'review.replied',
  REVIEW_SYNCED: 'review.synced',
  REVIEW_VIEWED: 'review.viewed',
  
  // User actions
  USER_INVITED: 'user.invited',
  USER_ROLE_CHANGED: 'user.role_changed',
  USER_REMOVED: 'user.removed',
  
  // Settings actions
  SETTINGS_UPDATED: 'settings.updated',
  ALERT_PREFS_UPDATED: 'alerts.preferences_updated',
  LOCATION_ADDED: 'location.added',
  LOCATION_DELETED: 'location.deleted',
  
  // Integration actions
  GOOGLE_CONNECTED: 'integration.google_connected',
  GOOGLE_DISCONNECTED: 'integration.google_disconnected',
  
  // Subscription actions
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
} as const;

// Helper functions for common audit events
export const AuditHelpers = {
  logReviewReply: async (organizationId: string, userId: string, reviewId: string, replyId: string) => {
    await logAuditEvent({
      organizationId,
      userId,
      action: AuditActions.REVIEW_REPLIED,
      targetId: reviewId,
      metadata: { replyId },
    });
  },

  logUserRoleChange: async (
    organizationId: string, 
    adminUserId: string, 
    targetUserId: string, 
    oldRole: string, 
    newRole: string
  ) => {
    await logAuditEvent({
      organizationId,
      userId: adminUserId,
      action: AuditActions.USER_ROLE_CHANGED,
      targetId: targetUserId,
      metadata: { oldRole, newRole },
    });
  },

  logSettingsUpdate: async (organizationId: string, userId: string, settingsType: string) => {
    await logAuditEvent({
      organizationId,
      userId,
      action: AuditActions.SETTINGS_UPDATED,
      metadata: { settingsType },
    });
  },

  logLocationDelete: async (organizationId: string, userId: string, locationId: string, locationName: string) => {
    await logAuditEvent({
      organizationId,
      userId,
      action: AuditActions.LOCATION_DELETED,
      targetId: locationId,
      metadata: { locationName },
    });
  },

  logGoogleConnection: async (organizationId: string, userId: string) => {
    await logAuditEvent({
      organizationId,
      userId,
      action: AuditActions.GOOGLE_CONNECTED,
    });
  },
};
