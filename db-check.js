#!/usr/bin/env node

/**
 * Database Connection and Query Script for Neon PostgreSQL
 * 
 * This script connects to a Neon PostgreSQL database, lists all tables,
 * and fetches sample data from a users table (if it exists).
 * 
 * Prerequisites:
 * - Node.js installed
 * - npm install pg dotenv
 * - .env file with DATABASE_URL
 * 
 * Usage: node db-check.js
 */

// Import required modules
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Validate that DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL not found in environment variables');
    console.error('Please ensure your .env file contains the DATABASE_URL');
    process.exit(1);
}

// Create a new connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Neon
    }
});

/**
 * Main function to execute database operations
 */
async function main() {
    let client;
    
    try {
        console.log('🚀 Starting database connection...');
        console.log('📡 Connecting to Neon PostgreSQL database...\n');
        
        // Get a client from the pool
        client = await pool.connect();
        console.log('✅ Successfully connected to the database!\n');
        
        // Task 1: List all tables in the database
        console.log('📋 Task 1: Listing all tables in the database...');
        console.log('=' .repeat(50));
        
        const tablesQuery = `
            SELECT 
                table_schema,
                table_name,
                table_type
            FROM information_schema.tables 
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
            ORDER BY table_schema, table_name;
        `;
        
        const tablesResult = await client.query(tablesQuery);
        
        if (tablesResult.rows.length === 0) {
            console.log('📭 No user tables found in the database.');
        } else {
            console.log(`📊 Found ${tablesResult.rows.length} table(s):\n`);
            tablesResult.rows.forEach((row, index) => {
                console.log(`${index + 1}. Schema: ${row.table_schema}`);
                console.log(`   Table: ${row.table_name}`);
                console.log(`   Type: ${row.table_type}`);
                console.log('');
            });
        }
        
        // Task 2: Try to fetch sample data from a users table
        console.log('👥 Task 2: Attempting to fetch sample data...');
        console.log('=' .repeat(50));
        
        // First, check if a users table exists
        const usersTableCheck = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'users' 
            AND table_schema NOT IN ('information_schema', 'pg_catalog');
        `;
        
        const usersTableResult = await client.query(usersTableCheck);
        
        if (usersTableResult.rows.length === 0) {
            console.log('❌ No "users" table found in the database.');
            console.log('💡 Checking for other common table names...\n');
            
            // Check for other common table names
            const commonTables = ['user', 'customers', 'accounts', 'profiles'];
            
            for (const tableName of commonTables) {
                const checkQuery = `
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_name = $1 
                    AND table_schema NOT IN ('information_schema', 'pg_catalog');
                `;
                
                const checkResult = await client.query(checkQuery, [tableName]);
                
                if (checkResult.rows.length > 0) {
                    console.log(`✅ Found table: ${tableName}`);
                    await fetchSampleData(client, tableName);
                    break;
                }
            }
            
            // If no common tables found, show the first available table
            if (tablesResult.rows.length > 0) {
                const firstTable = tablesResult.rows[0].table_name;
                console.log(`\n🔄 No common tables found. Trying first available table: ${firstTable}`);
                await fetchSampleData(client, firstTable);
            }
        } else {
            console.log('✅ Found "users" table! Fetching sample data...\n');
            await fetchSampleData(client, 'users');
        }
        
        // Task 3: Display database information
        console.log('ℹ️  Task 3: Database Information');
        console.log('=' .repeat(50));
        
        const dbInfoQuery = `
            SELECT 
                current_database() as database_name,
                current_user as current_user,
                version() as postgres_version,
                inet_server_addr() as server_address,
                inet_server_port() as server_port;
        `;
        
        const dbInfoResult = await client.query(dbInfoQuery);
        const dbInfo = dbInfoResult.rows[0];
        
        console.log(`🗄️  Database Name: ${dbInfo.database_name}`);
        console.log(`👤 Current User: ${dbInfo.current_user}`);
        console.log(`🔧 PostgreSQL Version: ${dbInfo.postgres_version.split(' ')[0]} ${dbInfo.postgres_version.split(' ')[1]}`);
        console.log(`🌐 Server Address: ${dbInfo.server_address || 'Not available'}`);
        console.log(`🔌 Server Port: ${dbInfo.server_port || 'Not available'}\n`);
        
        console.log('🎉 All tasks completed successfully!');
        
    } catch (error) {
        console.error('❌ An error occurred:');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.code);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Connection refused. Please check:');
            console.error('   - Database URL is correct');
            console.error('   - Database server is running');
            console.error('   - Network connectivity');
        } else if (error.code === 'ENOTFOUND') {
            console.error('\n💡 Host not found. Please check:');
            console.error('   - Database URL is correct');
            console.error('   - DNS resolution');
        } else if (error.code === '28P01') {
            console.error('\n💡 Authentication failed. Please check:');
            console.error('   - Username and password are correct');
            console.error('   - User has proper permissions');
        }
        
        process.exit(1);
    } finally {
        // Always close the client connection
        if (client) {
            client.release();
            console.log('🔌 Database connection closed.');
        }
        
        // Close the pool
        await pool.end();
        console.log('🏁 Connection pool closed.');
    }
}

/**
 * Helper function to fetch sample data from a table
 * @param {Object} client - Database client
 * @param {string} tableName - Name of the table to query
 */
async function fetchSampleData(client, tableName) {
    try {
        // First, get column information
        const columnsQuery = `
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = $1 
            AND table_schema NOT IN ('information_schema', 'pg_catalog')
            ORDER BY ordinal_position;
        `;
        
        const columnsResult = await client.query(columnsQuery, [tableName]);
        
        if (columnsResult.rows.length === 0) {
            console.log(`❌ No columns found for table: ${tableName}`);
            return;
        }
        
        console.log(`📊 Table: ${tableName}`);
        console.log(`📋 Columns (${columnsResult.rows.length}):`);
        columnsResult.rows.forEach((col, index) => {
            console.log(`   ${index + 1}. ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? '[nullable]' : '[not null]'}`);
        });
        console.log('');
        
        // Get row count
        const countQuery = `SELECT COUNT(*) as total_rows FROM ${tableName};`;
        const countResult = await client.query(countQuery);
        const totalRows = parseInt(countResult.rows[0].total_rows);
        
        console.log(`📈 Total rows in ${tableName}: ${totalRows}`);
        
        if (totalRows === 0) {
            console.log('📭 Table is empty - no data to display.\n');
            return;
        }
        
        // Fetch first 5 rows
        const sampleQuery = `SELECT * FROM ${tableName} LIMIT 5;`;
        const sampleResult = await client.query(sampleQuery);
        
        console.log(`\n📄 Sample data (first ${Math.min(5, totalRows)} rows):`);
        console.log('-'.repeat(60));
        
        sampleResult.rows.forEach((row, index) => {
            console.log(`Row ${index + 1}:`);
            Object.entries(row).forEach(([key, value]) => {
                const displayValue = value === null ? 'NULL' : 
                                   typeof value === 'string' && value.length > 50 ? 
                                   value.substring(0, 50) + '...' : value;
                console.log(`  ${key}: ${displayValue}`);
            });
            console.log('');
        });
        
        if (totalRows > 5) {
            console.log(`... and ${totalRows - 5} more rows.\n`);
        }
        
    } catch (error) {
        console.error(`❌ Error fetching data from table ${tableName}:`);
        console.error('Error:', error.message);
        console.log('');
    }
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Closing database connections...');
    await pool.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Closing database connections...');
    await pool.end();
    process.exit(0);
});

// Run the main function
if (require.main === module) {
    main().catch((error) => {
        console.error('💥 Unhandled error:', error);
        process.exit(1);
    });
}

module.exports = { main, fetchSampleData };
