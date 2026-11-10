# Lottery Number Reservation System

A simple web-based system for managing lottery number reservations.

## Features

- Display 100 lottery numbers with reservation status
- Admin panel to reserve/unreserve numbers
- Real-time updates (auto-refresh every 5 seconds)
- Optional participant names for reservations
- Responsive design for mobile and desktop

## Setup

1. Install dependencies:
```
npm install
```

2. Run the server:
```
npm start
```

3. Open in browser:
   - Public view: http://localhost:3000
   - Admin panel: http://localhost:3000/admin.html

## Deployment (Free)

### Option 1: Render
1. Create account at render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Deploy (free tier)

### Option 2: Railway
1. Create account at railway.app
2. Create new project from GitHub
3. Deploy (free tier)

## Usage

### Admin:
1. Go to /admin.html
2. Click any number to reserve/unreserve it
3. Optionally add participant name when reserving

### Participants:
1. Go to main page (/)
2. View available (green) and reserved (red) numbers
3. Page auto-refreshes every 5 seconds
