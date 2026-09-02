# TestMandi — Production Deployment Checklist

This app is functionally complete and tested (auth, checkout, referrals, bundles,
ads, payouts, admin — all working end-to-end against a local backend). This
document lists what still needs attention before real users rely on it.

## What to deploy

- **Backend**: everything in `testmandi-server/` (Node/Express). Needs a host
  that runs a persistent Node process — a VPS, Render, Railway, etc. Not
  static hosting, not serverless/Workers-style platforms (it needs a normal
  filesystem and a long-running process).
- **Frontend**: `testmandi.jsx` (rename to `App.jsx`) + `api.js`, inside a
  standard Vite React project. Build with `npm run build`, deploy the `dist`
  folder to any static host.

## Required before going live

1. **Set `VITE_API_BASE` before building the frontend.** Vite bakes env vars
   in at build time. `VITE_API_BASE=https://your-backend-domain` must be set
   in the frontend's `.env` *before* running `npm run build`, or the deployed
   site will try to reach `localhost:4000` and fail for every visitor.

2. **Set every backend `.env` value for real** (see `testmandi-server/.env.example`):
   - `MONGODB_URI` — your real MongoDB Atlas connection string (free M0
     cluster is enough to start). Under Atlas's Network Access, make sure the
     deploying server's IP is allowed (or use `0.0.0.0/0` if it's not fixed).
   - `JWT_SECRET` — a long random string, not the placeholder.
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — change the password after first login.
   - `CORS_ORIGIN` — must list every real frontend domain (comma-separated),
     e.g. `https://testmandi.in,https://www.testmandi.in`. Requests from any
     origin not listed here are rejected by the backend.
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — **switch from test-mode keys
     to live keys** once ready to accept real payments (Razorpay requires
     business KYC verification for live mode).
   - `ANTHROPIC_API_KEY` — for the support chatbot.

3. **Email sending is now implemented via SMTP** (nodemailer) — set
   `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM` in `.env`. The
   easiest option since you own testmandi.in: create a mailbox in Hostinger's
   hPanel (e.g. `no-reply@testmandi.in`) and point SMTP at it — see the
   comments in `.env.example` for exact settings. Also set `PUBLIC_APP_URL`
   to your real frontend URL (a single URL, not the CORS_ORIGIN list) so
   email links point to the right place. If these are left blank, emails
   still print to the server console instead of sending — fine for local
   dev, not fine for real users.

4. **Run the Node process with a process manager** (PM2 or systemd), not
   directly via `npm run dev`/`node index.js` in a terminal you might close.
   PM2 example: `pm2 start index.js --name testmandi-api`, then
   `pm2 startup` + `pm2 save` so it survives a server reboot.

5. **Put it behind Nginx (or similar) with HTTPS.** The backend itself speaks
   plain HTTP on whatever `PORT` is set. A reverse proxy handling TLS
   (Let's Encrypt via Certbot is free) should sit in front of it — never
   expose the raw Node process directly to the internet on an HTTP port.

6. **Back up your MongoDB Atlas data regularly.** The free M0 tier has no
   automatic backups — enable Atlas's paid backup feature once real money and
   real accounts depend on this, or set up your own periodic export
   (`mongodump`) in the meantime.

## Known, accepted gaps (not blockers, but real)

- **Profit-split enforcement**: the seller/platform percentage is sent by the
  browser on withdrawal rather than being a value the server independently
  enforces. Not exploitable through the normal UI, but not a hardened trust
  boundary either.
- **No automated tests.** Everything has been manually verified through this
  build process, not covered by an automated test suite.

## Quick sanity check after deploying

1. Visit `https://your-backend-domain/api/categories` directly — should
   return JSON, not an error or "Cannot GET".
2. Register a real account on the live frontend, confirm no CORS errors.
3. Make a real (or Razorpay test-mode) purchase end to end.
4. Trigger a password reset and confirm your email provider actually sends
   it once step 3 above (email integration) is done.
