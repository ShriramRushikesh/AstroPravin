# 🏛️ AUDIT/01_ARCHITECTURE.md
## AstroPravin — Enterprise Architecture & System Mapping

**Audit Date:** October 2, 2026  
**Auditor:** Principal DevOps & Security Architect (SRE)  
**Target Platform:** AstroPravin Vedic Astrology, Matrimony, AstroStore & Consultation Portal  
**Repository:** `ShriramRushikesh/AstroPravin`  
**Branch:** `audit/enterprise-readiness`

---

### 1. Executive System Topology

```mermaid
graph TD
    Client["Client Browser (React 18 + Vite SPA)"]
    CDN["Vercel Edge Network / CDN"]
    APIGateway["NestJS API Gateway (:5002 /api)"]
    DB[(MongoDB Atlas Cluster)]
    Razorpay["Razorpay Payment Gateway API"]
    Email["SMTP / Nodemailer Service"]

    Client -->|HTTPS / WSS| CDN
    CDN -->|Static Assets| Client
    Client -->|REST API Calls (/api/*)| APIGateway
    APIGateway -->|Throttler & Helmet & CORS| APIGateway
    APIGateway -->|Mongoose ODM / Connection Pool| DB
    APIGateway -->|Order Creation & HMAC SHA-256| Razorpay
    APIGateway -->|Async Booking / ICS Confirmation| Email
```

---

### 2. Frontend Architecture & Component Decomposition

* **Core Framework:** React 18.3.1, Vite 7.x, Tailwind CSS 3.4.0, Framer Motion 10.18.0.
* **State & Context Management:**
  * `CartContext` (`src/context/CartContext.jsx`) — Cart items, total pricing, and drawer state.
  * `useMatrimonyAuth` (`src/pages/Matrimony/hooks/useMatrimonyAuth.js`) — Matrimony member authentication, JWT token caching, and profile state.
* **Routing & Code-Splitting Structure:**
  * **Public Landing & Info:** `/`, `/about`, `/contact`, `/privacy-policy`, `/terms-conditions`, `/disclaimer`.
  * **Vedic Astrology & Planetary:** `/planets`, `/planet/:id`, `/numerology`, `/videos`.
  * **E-Commerce & AstroStore:** `/store`, `/cart` (CartDrawer).
  * **Knowledge Base:** `/blogs`, `/blog/:slug`.
  * **Matrimony Platform:** `/matrimony/*` (Onboarding, Login, Profile Wizard, Matches, Gun Milan, Chat, Interests).
  * **Admin CRM Dashboard:** `/admin/*` (Consultations, Store Orders, Matrimony CRM, Member Management, Verification Queue).

---

### 3. Backend Architecture & Service Boundaries

* **Framework:** NestJS 11.x on Node.js (CommonJS + SWC Compiler).
* **Global Configuration & Middleware Pipeline:**
  1. `dotenv` multi-path environment configuration.
  2. `helmet` security header injection (`crossOriginResourcePolicy: 'cross-origin'`, `crossOriginOpenerPolicy: 'same-origin-allow-popups'`).
  3. `ThrottlerGuard` multi-tier rate limiting (15 req/1s, 60 req/10s, 200 req/60s).
  4. `ValidationPipe` with payload whitelisting & type transformation.
  5. Static asset pipeline for `/public/uploads` and `/public/kundlis`.

#### Service Module Map:

| Module | Controllers | Services / Logic | Schemas / Collections | Protection Level |
| :--- | :--- | :--- | :--- | :--- |
| **AuthModule** | `AuthController` (`/api/auth`) | `AuthService`, `JwtStrategy` | N/A (Admin Auth) | Public Login / JWT Protected Routes |
| **BookingModule** | `BookingController` (`/api/bookings`) | `BookingService` | `Booking` (`bookings`) | Public Creation / JWT Guarded Mutation & List |
| **KundliModule** | `KundliController`, `LeadsController` | `KundliService`, `GunMilanService`, `PdfGenerator` | `Lead` (`leads`) | Public Horoscope Calc & Lead Capture |
| **MatrimonyModule** | `MatrimonyAuthController`, `MatrimonyProfileController`, `MatrimonyInteractionController`, `MatrimonyGunMilanController`, `MatrimonyAdminController`, `MatrimonyCrmController`, `MatrimonyPaymentController` | 7 Specialized Services | 12 Schemas (`matrimonyusers`, `matrimonyprofiles`, `crmleads`, `matrimonysubscriptions`, etc.) | Hybrid: Public Register/Login, Member JWT Guarded, Admin Guarded |
| **PaymentModule** | `PaymentController` (`/api/payments`) | `PaymentService` | Transaction metadata | Public Config / Order Creation & HMAC Verification |
| **ProductsModule** | `ProductsController`, `OrdersController` | `ProductsService`, `OrdersService` | `Product`, `Order` | Public Catalog / Secure Checkout & Order Tracking |
| **BlogsModule** | `BlogsController` (`/api/blogs`) | `BlogsService` | `Blog` | Public Read / Admin Mutation |
| **ServicesModule** | `ServicesController` (`/api/services`) | `ServicesService` | `Service` | Public Read / Admin Mutation |
| **SharedModule** | `SharedController`, `UploadController` | `SharedService`, `EmailService` | `Visitor`, `Video` | Public Visits & Media Serving |

---

### 4. Database Access Patterns & Schema Mapping

* **MongoDB Atlas Connection Pool:** Managed via `@nestjs/mongoose` with fail-fast timeouts (`serverSelectionTimeoutMS: 8000`, `connectTimeoutMS: 8000`).
* **Critical Collections:**
  * `bookings` — Consultation appointments, customer phone/email, birth details, status, and transaction references.
  * `orders` — AstroStore e-commerce purchases, line items, customer shipping details, payment receipt numbers.
  * `matrimonyusers` & `matrimonyprofiles` — Matrimony member identity, password hashes, phone numbers, biodata, photos, and match preferences.
  * `matrimonysubscriptions` — Premium matrimony access tiers, validity periods, Razorpay transaction links.
  * `crmleads` & `crmcalllogs` — Customer follow-up pipeline for high-value consultations and matrimony matchmaking.

---

### 5. Identified Architectural Inconsistencies & Legacy Debt

1. **Root `package.json` vs Server Dependencies:**
   * Backend libraries (`pdfkit`, `express`, `mongoose`, `nodemailer`, `twilio`, `bcryptjs`, `jsonwebtoken`) were previously present in root `package.json` despite the backend having migrated to NestJS inside `/server`. This caused bundle bloat and build confusion.
2. **Hardcoded Fallback Strings in Authentication & Payment Modules:**
   * Fallback secrets existed in `MatrimonyJwtStrategy`, `MatrimonyModule`, and payment services. While primary secrets were in `.env`, fallbacks violate secure-by-default standards.
3. **Database Indexing Gaps:**
   * High-frequency queries (e.g. `.find().sort({ createdAt: -1 })` and lookups by `phone`/`email`) lacked explicit compound and secondary indexes on MongoDB schemas.
