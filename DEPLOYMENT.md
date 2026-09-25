# RescueRoute — Production Deployment Guide

This guide describes how to run and deploy RescueRoute in a production environment with real authentication, real MongoDB persistence, Leaflet + OpenStreetMap visual routing, multi-language internationalization, and deterministic match/dispatch algorithms.

---

## 1. System Requirements

- **Node.js**: `v18.x` or `v20.x+` (LTS recommended)
- **MongoDB**: `v6.x` or `v7.x` (Local instance or MongoDB Atlas)
- **Network**: Internet access for OpenStreetMap tiles and optional Gemini AI API

---

## 2. Environment Configuration

### Backend Environment (`backend/.env`)

Create or update `backend/.env` with your production settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/rescueroute
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/rescueroute?retryWrites=true&w=majority

# JWT Security
JWT_SECRET=your_secure_256bit_production_secret_here
JWT_EXPIRES_IN=7d

# CORS Allowed Origin
CORS_ORIGIN=http://localhost:5173

# Optional: Google Gemini AI (For donation parsing & match explanation)
# If omitted, deterministic fallbacks will be used automatically
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend Environment (`.env`)

Create or update `.env` in the project root:

```env
# Production Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 3. Database Initialization & Seeding

RescueRoute provides a database seed script with sample production-ready accounts, donations, matches, and public food requests:

```bash
# Seed initial real data
npm run seed
```

### Pre-Configured Accounts (Password: `password123`)

| Role | Email | Name / Organization |
| :--- | :--- | :--- |
| **Donor** | `marcus@greenleafbistro.com` | Marcus Vance (Green Leaf Bistro) |
| **Shelter** | `contact@hopeshelter.org` | Sarah Jenkins (Hope Center Shelter) |
| **Driver** | `alex.rivera@volunteer.org` | Alex Rivera (Volunteer Courier) |
| **Admin** | `admin@rescueroute.org` | Admin Coordinator (Platform Operations) |

---

## 4. Building & Running in Production

### Step A: Install Dependencies
```bash
npm install
```

### Step B: Build Frontend
Compile the production-ready React client into optimized static assets in `/dist`:
```bash
npm run build
```

### Step C: Start the Backend Server
```bash
npm run server
```
The backend API will start on `http://localhost:5000` with MongoDB connection pooling, NoSQL injection sanitization, rate limiting, and RBAC middleware.

### Step D: Serve the Frontend
For local production testing:
```bash
npm run preview
```
Or serve `/dist` using Nginx, Apache, or a static cloud host (Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront).

---

## 5. Production Nginx Reverse Proxy Configuration (Sample)

```nginx
server {
    listen 80;
    server_name rescueroute.yourdomain.org;

    # Frontend Static Files
    location / {
        root /var/www/rescueroute/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Reverse Proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 6. Testing & Quality Assurance

To execute all 16 automated test suites (149 tests):

```bash
# Run Vitest test suite once
npm test -- --run

# Run specifically backend end-to-end production verification
npx vitest run backend/test/e2eFlow.test.js
```

---

## 7. Production Features & Verification Checklist

- [x] **Zero Mock/Demo Modes**: Removed all simulation banners and fake data fallbacks; all states query MongoDB directly.
- [x] **Real JWT Authentication**: Http bearer authorization header with role-based routing (`DONOR`, `SHELTER`, `DRIVER`, `ADMIN`).
- [x] **Dietary Classifications**: Support for `Vegetarian`, `Non-Vegetarian`, `Eggetarian`, `Vegan`, and `Other` across donor creation, shelter matching, and filters.
- [x] **Multi-Language Support**: Complete interface localization for English (`en`), Spanish (`es`), Hindi (`hi`), Chinese (`zh`), and French (`fr`).
- [x] **Public Food Request Form (`/request-food`)**: Unauthenticated community submission with district coordinate presets and live map verification.
- [x] **Admin Food Request Desk**: Administrative review, status transitions (`APPROVED`, `FULFILLED`, `CANCELLED`), and automated impact tracking.
- [x] **Free Visual Maps**: Leaflet + OpenStreetMap rendering real database GeoJSON coordinates with zero API key dependencies or usage limits.
