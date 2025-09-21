# ReviewPilot Local Development Setup

This guide will help you set up and run both the frontend and backend of the ReviewPilot project on your local machine.

## Prerequisites

- **Node.js 18+** installed on your system
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)
- **Neon PostgreSQL database** (already configured)

## Project Structure

```
ReviewPilot/
├── frontend/           # React frontend application
│   ├── package.json
│   ├── src/
│   └── public/
├── backend/            # Node.js backend API
│   ├── package.json
│   ├── server.js
│   └── .env
├── env.example         # Database connection template
└── SETUP_INSTRUCTIONS.md
```

## Step-by-Step Setup Instructions

### Step 1: Environment Setup

1. **Copy the environment file:**
   ```bash
   cp env.example backend/.env
   ```
   
2. **Verify the .env file contains your database URL:**
   ```bash
   cat backend/.env
   ```
   Should show:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_5nfw6eUEWxlO@ep-rapid-fire-agmhhtrv-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

### Step 2: Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```
   
   This will install all required packages including:
   - Express.js (web framework)
   - PostgreSQL client (pg)
   - CORS middleware
   - Security middleware (helmet)
   - And many more...

3. **Start the backend server:**
   ```bash
   npm start
   ```
   
   **Alternative for development (with auto-restart):**
   ```bash
   npm run dev
   ```

4. **Verify backend is running:**
   - Open your browser and go to: `http://localhost:5000`
   - You should see: `{"message":"Welcome to ReviewPilot API","version":"1.0.0",...}`
   - Health check: `http://localhost:5000/health`
   - Database info: `http://localhost:5000/api/db/info`

### Step 3: Frontend Setup

1. **Open a new terminal window/tab**

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install frontend dependencies:**
   ```bash
   npm install
   ```
   
   This will install all required packages including:
   - React 18
   - React Router
   - TailwindCSS
   - Axios (for API calls)
   - And more...

4. **Start the frontend development server:**
   ```bash
   npm start
   ```

5. **Verify frontend is running:**
   - The React app should automatically open in your browser at: `http://localhost:3000`
   - If it doesn't open automatically, manually navigate to `http://localhost:3000`

### Step 4: Verify Full Stack Connection

1. **Check both servers are running:**
   - Backend: `http://localhost:5000` ✅
   - Frontend: `http://localhost:3000` ✅

2. **Test API connection from frontend:**
   - Open browser developer tools (F12)
   - Go to Console tab
   - You should see successful API calls to the backend

3. **Check database connection:**
   - Visit: `http://localhost:5000/api/db/info`
   - Should show database information and connection status

## Development Workflow

### Running Both Servers

**Option 1: Two Terminal Windows**
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm start`

**Option 2: Using npm scripts (if configured)**
```bash
# From project root
npm run dev:backend    # Starts backend in development mode
npm run dev:frontend   # Starts frontend in development mode
```

### Useful Commands

**Backend Commands:**
```bash
cd backend
npm start          # Start production server
npm run dev        # Start development server with auto-restart
npm test           # Run tests
npm run lint       # Check code quality
npm run lint:fix   # Fix linting issues
```

**Frontend Commands:**
```bash
cd frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Check code quality
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process using port 5000
   npx kill-port 5000
   
   # Or change port in backend/.env
   PORT=5001
   ```

2. **Database connection failed:**
   - Check your `.env` file has the correct DATABASE_URL
   - Verify your Neon database is active
   - Check network connectivity

3. **CORS errors:**
   - Ensure backend is running on port 5000
   - Check CORS configuration in server.js
   - Verify frontend is making requests to correct backend URL

4. **Module not found errors:**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### Getting Help

1. **Check server logs** for detailed error messages
2. **Verify environment variables** are loaded correctly
3. **Test database connection** using the provided db-check.js script
4. **Check browser console** for frontend errors

## Next Steps

Once both servers are running successfully:

1. **Start developing features** using the provided API structure
2. **Add new routes** in the backend/routes/ directory
3. **Create React components** in the frontend/src/ directory
4. **Test API endpoints** using tools like Postman or curl
5. **Implement the ReviewPilot features** as outlined in the PRD

## Production Deployment

For production deployment:

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set production environment variables:**
   ```bash
   NODE_ENV=production
   PORT=5000
   ```

3. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

---

**Happy coding! 🚀**

If you encounter any issues, check the troubleshooting section above or refer to the individual package.json files for more specific commands.
