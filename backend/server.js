#!/usr/bin/env node

/**
 * ReviewPilot Backend Server
 * 
 * Express.js server for the ReviewPilot review management platform.
 * Connects to Neon PostgreSQL database and provides API endpoints.
 * 
 * Prerequisites:
 * - Node.js 18+ installed
 * - PostgreSQL database (Neon)
 * - .env file with DATABASE_URL
 * 
 * Usage: npm start or node server.js
 */

// Import required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables
dotenv.config();

// Import route modules (to be created)
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const businessRoutes = require('./routes/businesses');
// const reviewRoutes = require('./routes/reviews');
// const alertRoutes = require('./routes/alerts');

// Initialize Express app
const app = express();

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Database configuration
const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create database connection pool
const pool = new Pool(dbConfig);

// Test database connection
async function testDatabaseConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        
        // Test query
        const result = await client.query('SELECT NOW() as current_time');
        console.log('📅 Database time:', result.rows[0].current_time);
        
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://reviewpilot.com',
            'https://www.reviewpilot.com'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Test database connection
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        
        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: NODE_ENV,
            database: 'connected'
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message,
            database: 'disconnected'
        });
    }
});

// API routes
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to ReviewPilot API',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/health'
    });
});

// Database info endpoint (for development)
app.get('/api/db/info', async (req, res) => {
    if (NODE_ENV !== 'development') {
        return res.status(404).json({ error: 'Not found' });
    }
    
    try {
        const client = await pool.connect();
        
        // Get database info
        const dbInfoQuery = `
            SELECT 
                current_database() as database_name,
                current_user as current_user,
                version() as postgres_version,
                inet_server_addr() as server_address,
                inet_server_port() as server_port;
        `;
        
        const dbInfoResult = await client.query(dbInfoQuery);
        
        // Get table count
        const tablesQuery = `
            SELECT COUNT(*) as table_count
            FROM information_schema.tables 
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog');
        `;
        
        const tablesResult = await client.query(tablesQuery);
        
        client.release();
        
        res.json({
            database: dbInfoResult.rows[0],
            tables: tablesResult.rows[0],
            connectionPool: {
                totalCount: pool.totalCount,
                idleCount: pool.idleCount,
                waitingCount: pool.waitingCount
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Database query failed',
            message: error.message
        });
    }
});

// API route handlers (to be implemented)
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/businesses', businessRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/alerts', alertRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        path: req.originalUrl,
        method: req.method,
        availableEndpoints: [
            'GET /api',
            'GET /health',
            'GET /api/db/info (development only)'
        ]
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('💥 Unhandled error:', error);
    
    // Don't leak error details in production
    const isDevelopment = NODE_ENV === 'development';
    
    res.status(error.status || 500).json({
        error: isDevelopment ? error.message : 'Internal server error',
        ...(isDevelopment && { stack: error.stack })
    });
});

// Graceful shutdown handler
async function gracefulShutdown(signal, serverInstance) {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    
    // Stop accepting new connections
    if (serverInstance) {
        serverInstance.close(() => {
            console.log('🔌 HTTP server closed.');
            
            // Close database pool
            pool.end(() => {
                console.log('🗄️  Database pool closed.');
                process.exit(0);
            });
        });
    } else {
        // Close database pool directly if no server instance
        pool.end(() => {
            console.log('🗄️  Database pool closed.');
            process.exit(0);
        });
    }
    
    // Force close after 10 seconds
    setTimeout(() => {
        console.error('⏰ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
}

// Handle process termination (will be set after server starts)
let serverInstance = null;

// Start server
async function startServer() {
    try {
        // Test database connection first
        const dbConnected = await testDatabaseConnection();
        
        if (!dbConnected) {
            console.error('❌ Cannot start server without database connection');
            process.exit(1);
        }
        
        // Start HTTP server
        const server = app.listen(PORT, () => {
            console.log('\n🚀 ReviewPilot Backend Server Started!');
            console.log('=' .repeat(50));
            console.log(`🌐 Server running on: http://localhost:${PORT}`);
            console.log(`🔧 Environment: ${NODE_ENV}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API docs: http://localhost:${PORT}/api`);
            console.log('=' .repeat(50));
            console.log('💡 Press Ctrl+C to stop the server\n');
        });
        
        // Set up process handlers after server is created
        serverInstance = server;
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM', serverInstance));
        process.on('SIGINT', () => gracefulShutdown('SIGINT', serverInstance));
        
        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use. Please choose a different port.`);
            } else {
                console.error('❌ Server error:', error);
            }
            process.exit(1);
        });
        
        return server;
        
    } catch (error) {
        console.error('💥 Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    startServer();
}

// Export for testing
module.exports = { app, pool, startServer };
