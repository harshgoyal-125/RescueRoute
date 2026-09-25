# 🚚 RescueRoute — Real-Time Food Rescue & Distribution Platform

RescueRoute connects food donors (restaurants, caterers, grocery stores) with local recipient shelters and volunteer dispatch drivers to eliminate edible food waste and combat food insecurity in real-time.

---

## 🌟 Key Features

1. **Deterministic Matching Engine**
   - Ranks and pairs surplus food donations with recipient shelters using real-time factors: Haversine distance, shelter capacity, dietary alignment, food category compatibility, and urgency.
   - 100% deterministic, audit-proof, and free of algorithmic bias.

2. **Smart Driver Dispatch & Live Workflow**
   - Automatically determines closest available volunteer drivers.
   - Full delivery lifecycle: `POSTED` → `MATCHED` → `DRIVER_ASSIGNED` → `PICKED_UP` → `DELIVERED`.

3. **Dietary Classifications & Dietary Badges**
   - Classifications: **Vegetarian (🌱)**, **Eggetarian (🥚)**, **Non-Vegetarian (🍗)**, **Vegan (🌿)**, and **Other**.
   - Available across donation postings, match cards, shelter match filters, and food requests.

4. **Multi-Language Support (i18n)**
   - Language selector on the initial login screen supporting:
     - 🇺🇸 **English** (`en`)
     - 🇪🇸 **Español** (`es`)
     - 🇮🇳 **हिन्दी** (`hi`)
     - 🇨🇳 **中文** (`zh`)
     - 🇫🇷 **Français** (`fr`)

5. **Public Food Request Form (`/request-food`)**
   - Allows community members, shelters, and outreach organizations to submit food requests directly without an account.
   - Interactive district coordinate presets and live map location preview.
   - Admin management desk on the Impact Dashboard for reviewing and approving incoming requests.

6. **Free Visual Maps (Leaflet + OpenStreetMap)**
   - 100% free and open-source mapping.
   - Zero Google Maps or paid API keys required.
   - Visualizes real donor, shelter, request, and delivery coordinates with custom markers and status popups.

7. **AI-Assisted Capabilities (Google Gemini)**
   - *Match explanation*: Provides clear, natural language summaries explaining the deterministic match criteria.
   - *Deterministic fallbacks*: Safe, non-blocking operation if API key is unconfigured or rate-limited.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Leaflet, Tailwind/CSS Custom System
- **Backend**: Node.js, Express, MongoDB, Mongoose ODM, JWT Authentication, Supertest
- **Testing**: Vitest (16 test suites, 147 tests passing)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `localhost:27017` or a MongoDB Atlas URI

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Development Servers
Run both frontend and backend concurrently:
```bash
npm run dev:all
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## 🔑 Demo & Test Credentials

All accounts use the password: `password123`

| Role | Email | Use Case |
| :--- | :--- | :--- |
| **Donor** | `marcus@greenleafbistro.com` | Create donations, test AI parsing, view listing history |
| **Shelter** | `contact@hopeshelter.org` | Review match recommendations, filter by diet, accept matches |
| **Driver** | `alex.rivera@volunteer.org` | View assigned route, update pickup & delivery status |
| **Admin** | `admin@rescueroute.org` | View impact metrics, city map, approve public food requests |

---

## 🧪 Running Tests

```bash
# Run all 16 test suites
npm test -- --run

# Run End-to-End verification test
npx vitest run backend/test/e2eFlow.test.js
```

---

## 📦 Production Deployment

See [DEPLOYMENT.md](file:///DEPLOYMENT.md) for full instructions on configuring environment variables, running production builds, and setting up Nginx reverse proxy.
