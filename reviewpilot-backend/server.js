const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
    status: "healthy"
  });
});

app.get('/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api', (req, res) => {
  res.json({
    message: "Welcome to ReviewPilot API",
    version: "1.0.0",
    endpoints: [
      "GET / - Server status",
      "GET /health - Health check with database",
      "GET /api - API information"
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
      console.error('❌ Cannot start server without database connection');
      process.exit(1);
    }
    
    // Start the server
    app.listen(port, () => {
      console.log('\n🚀 ReviewPilot Backend Server Started!');
      console.log('=' .repeat(50));
      console.log(`🌐 Server is listening on port ${port}`);
      console.log(`🔗 URL: http://localhost:${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`📚 API info: http://localhost:${port}/api`);
      console.log('=' .repeat(50));
      console.log('💡 Press Ctrl+C to stop the server\n');
    });
    
  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  pool.end(() => {
    console.log('🗄️  Database connection closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  pool.end(() => {
    console.log('🗄️  Database connection closed.');
    process.exit(0);
  });
});

// Start the server
startServer();
