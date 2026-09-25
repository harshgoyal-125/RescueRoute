# RescueRoute — Project Context & Architecture

## System Overview
RescueRoute is a real-time surplus food rescue platform connecting food donors (restaurants, caterers, grocery stores) with local recipient shelters and volunteer dispatch drivers.

## Technology Stack
- **Frontend**: React 18 + Vite (SPA)
- **Backend**: Node.js + Express 4 (MVC REST API)
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT bearer tokens + Role-Based Access Control (`DONOR`, `SHELTER`, `DRIVER`, `ADMIN`)
- **AI Integration**: Google Gemini API via official `@google/genai` SDK

---

# AI Architecture

Gemini is strictly constrained to two informational, additive capabilities:

1. **Free-Text Donation Parsing (`POST /api/ai/parse-donation`)**:
   - Allows food donors to write natural descriptions (e.g. *"We have around 40 leftover vegetable biryani meals available until 9 PM today."*), which the AI parses into structured JSON fields (`foodType`, `quantity`, `quantityUnit`, `availableUntil`, `description`).
   - Populates the donation form as pre-filled suggestions. The donor retains full control to inspect, edit, or clear every field before submitting.

2. **Human-Readable Match Explanation (`POST /api/ai/explain-match`)**:
   - Explains *why* the deterministic matching engine ranked and paired a shelter with a donation (distance proximity, available capacity, dietary alignment, and urgency).
   - Authoritative deterministic values (match score, score breakdown, eligibility) are fetched exclusively server-side from MongoDB and provided to Gemini as immutable context.
   - Includes automatic deterministic fallback explanation if Gemini is unavailable, rate-limited, or unconfigured.

### Strict AI Boundaries
Gemini **MUST NOT**:
1. Select, rank, approve, or reject recipient shelters.
2. Calculate or modify the match score or scoring weights.
3. Assign, choose, or dispatch volunteer drivers.
4. Classify or certify food safety.
5. Modify donation, match, or delivery status.
6. Directly write to or query MongoDB.
7. Make operational routing or dispatch decisions.

---

# Deterministic Business Logic (Source of Truth)

All core, business-critical decisions remain 100% deterministic, non-AI, server-side algorithms:
1. **Deterministic Matching Engine (`backend/src/services/matchingService.js`)**: Evaluates proximity (Haversine distance), shelter capacity, food compatibility, urgency, and need score.
2. **Deterministic Dispatch Engine (`backend/src/services/dispatchService.js`)**: Assigns volunteer drivers based on proximity, active workload balancing, and a 50 km operational dispatch radius.
3. **State Machine (`backend/src/models/Delivery.js`)**: Enforces strict lifecycle progression:
   `POSTED` → `MATCHED` → `DRIVER_ASSIGNED` → `PICKED_UP` → `DELIVERED`.

---

# Completed Tasks
- **Task 01**: React Frontend Core UI, Role Portals, and Mock Flow
- **Task 02**: Node.js + Express Backend, MongoDB, JWT Auth & Security
- **Task 03**: Deterministic Matching Engine & Shelter Recommendations
- **Task 04**: Driver Dispatch & Delivery Lifecycle Workflow
- **Task 05**: AI-Powered Free-Text Donation Parsing (Gemini)
- **Task 06**: AI Match Explanation (Gemini with Deterministic Fallback)
- **Task 07**: Free/Static Visual Map (Leaflet + OpenStreetMap)
- **Task 08**: Production Deployment Readiness & Full System Verification
  - Eradicated all mock/demo modes and simulation fallbacks; 100% real MongoDB data
  - Dietary Classifications: Vegetarian, Non-Vegetarian, Eggetarian, Vegan, Other
  - Multi-Language Localization: English, Spanish, Hindi, Chinese, French
  - Public Food Request flow (`/request-food`) and Admin Request Desk
  - Complete End-to-End production verification test suite
- **Task 09**: Frontend Polish & Component Refinement
  - Removed language selector from the main navigation bar for a cleaner, distraction-free top header (retained on login entry)
  - Removed "Parse with AI" card from Create Donation Page for a direct, responsive, and deterministic donation entry workflow
  - Audited and verified all UI elements, links, modals, maps, filters, and role portals
  - All 16 test suites pass (147 tests) and Vite production build succeeds cleanly

# Known Bugs
- None. (All 16 full-stack test suites pass with 100% pass rate; Vite production build succeeds cleanly).

# Important Decisions
- **Non-Authoritative AI**: AI explanations are purely explanatory; deterministic matching remains the sole source of truth.
- **Fail-Safe Operation**: If Gemini is offline, rate-limited, or unconfigured, the matching system automatically serves deterministic summaries without blocking shelter match acceptance.
- **No Client Forgery**: Match explanation endpoints query MongoDB directly to prevent clients from fabricating scores or criteria.
- **Zero Paid Mapping APIs**: Strictly Leaflet and OpenStreetMap tiles; zero reliance on Google Maps or third-party paid keys.
