import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export interface UserRole {
  userId: string;
  organizationId: string;
  role: Role;
}

export async function getUserRole(userId: string, organizationId: string): Promise<UserRole | null> {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
    select: {
      userId: true,
      organizationId: true,
      role: true,
    },
  });

  return membership;
}

export async function requireRole(
  userId: string,
  organizationId: string,
  allowedRoles: Role[]
): Promise<UserRole> {
  const userRole = await getUserRole(userId, organizationId);
  
  if (!userRole) {
    throw new Error('User is not a member of this organization');
  }
  
  if (!allowedRoles.includes(userRole.role)) {
    throw new Error(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
  }
  
  return userRole;
}

export async function requireOwner(userId: string, organizationId: string): Promise<UserRole> {
  return requireRole(userId, organizationId, ['owner']);
}

export async function requireOwnerOrMember(userId: string, organizationId: string): Promise<UserRole> {
  return requireRole(userId, organizationId, ['owner', 'member']);
}

export async function requireAnyRole(userId: string, organizationId: string): Promise<UserRole> {
  return requireRole(userId, organizationId, ['owner', 'member', 'viewer']);
}

// Helper to check if user can perform action
export function canPerformAction(userRole: Role, action: string): boolean {
  switch (action) {
    case 'read':
      return ['owner', 'member', 'viewer'].includes(userRole);
    case 'write':
    case 'update':
    case 'delete':
      return ['owner', 'member'].includes(userRole);
    case 'admin':
    case 'invite':
    case 'manage_roles':
      return userRole === 'owner';
    default:
      return false;
  }
}

// Helper to check if user is viewer (read-only)
export function isViewer(userRole: Role): boolean {
  return userRole === 'viewer';
}

// Helper to check if user is owner
export function isOwner(userRole: Role): boolean {
  return userRole === 'owner';
}

// Helper to check if user can manage organization
export function canManageOrg(userRole: Role): boolean {
  return userRole === 'owner';
}
