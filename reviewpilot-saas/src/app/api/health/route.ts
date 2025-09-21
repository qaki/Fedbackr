import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Basic health check
    const startTime = Date.now();
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startTime;
    
    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'GOOGLE_OAUTH_CLIENT_ID',
      'GOOGLE_OAUTH_CLIENT_SECRET',
      'LEMON_SQUEEZY_API_KEY',
      'LEMON_SQUEEZY_WEBHOOK_SECRET',
      'APP_ENCRYPTION_KEY'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'connected',
        latency: `${dbLatency}ms`
      },
      environment_variables: {
        status: missingEnvVars.length === 0 ? 'complete' : 'incomplete',
        missing: missingEnvVars
      },
      services: {
        database: 'operational',
        api: 'operational',
        webhooks: 'operational'
      }
    };
    
    // If critical services are down, return 503
    if (missingEnvVars.length > 0 || dbLatency > 5000) {
      health.status = 'degraded';
      return NextResponse.json(health, { status: 503 });
    }
    
    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    const health = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      environment: process.env.NODE_ENV || 'development',
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        database: 'down',
        api: 'operational',
        webhooks: 'unknown'
      }
    };
    
    return NextResponse.json(health, { status: 503 });
  }
}