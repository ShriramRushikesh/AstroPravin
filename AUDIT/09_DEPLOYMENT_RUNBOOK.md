# 🚀 AUDIT/09_DEPLOYMENT_RUNBOOK.md
## AstroPravin — Production Deployment, Rollback & Incident Runbook

**Audit Date:** October 2, 2026  
**Auditor:** Principal Site Reliability Engineer (SRE)  
**Target Environments:** Vercel (Frontend), Render / AWS App Runner (Backend), MongoDB Atlas (Database)

---

### 1. Pre-Flight Deployment Checklist

- [ ] Ensure MongoDB Atlas IP Whitelist allows connections from hosting provider (e.g. `0.0.0.0/0` with strong authentication).
- [ ] Confirm the following Environment Variables are configured in your Cloud Hosting Provider Dashboard:
  - `MONGODB_URI`: `mongodb+srv://...`
  - `JWT_SECRET`: `[High-entropy 256-bit key]`
  - `ADMIN_PASSWORD`: `[Secure Master Admin Password]`
  - `RAZORPAY_KEY_ID`: `rzp_live_...`
  - `RAZORPAY_KEY_SECRET`: `[Live Secret Key]`
  - `PORT`: Assigned dynamically or `10000` / `5002`
- [ ] In Vercel Project Settings, set `VITE_API_URL` to your production backend API domain (e.g. `https://api.astropravin.com`).

---

### 2. Standard Zero-Downtime Deployment Steps

#### Step 1: Deploy Backend (Render / AWS)
1. Push release branch or tag to GitHub (`main`).
2. Trigger backend build:
   ```bash
   cd server && npm install && npm run build
   ```
3. Start production daemon:
   ```bash
   npm run start:prod
   ```
4. Verify backend health:
   ```bash
   curl -I https://<your-backend-domain>/api
   ```
   *Expected: HTTP 200 / 404 with standard NestJS header output.*

#### Step 2: Deploy Frontend (Vercel)
1. Vercel automatically detects new commits on `main`.
2. Vercel executes `npm run build` and serves static assets from `dist/`.
3. Open `https://astropravin.com` in an incognito window and verify homepage loads with zero console errors.

---

### 3. Rollback Procedure

If unexpected latency, payment failures, or errors occur post-deployment:
1. **Frontend Instant Rollback:**
   * Go to Vercel Dashboard -> **Deployments** -> Find the previous stable deployment -> Click **"Instant Rollback"** (traffic shifts immediately in < 5 seconds).
2. **Backend Rollback:**
   * In Render / AWS Dashboard -> Deploy previous successful build tag or git commit.
3. **Database Safeguard:**
   * Mongoose schema migrations are backward-compatible. No destructive schema alters are executed during deploy.
