# TestMandi API

A real backend for TestMandi: accounts + passwords stored properly, purchases and
payouts persisted to disk, real Razorpay payments, rate limiting, email
verification, password reset, refresh tokens, and a chatbot proxy that keeps
your Anthropic API key off the browser.

## 1. Install

```
cd testmandi-server
npm install
```

## 2. Set up a free MongoDB Atlas database

1. Go to https://cloud.mongodb.com and create a free account.
2. Create a free **M0** cluster (no card required for the free tier).
3. Under **Database Access**, add a database user with a password.
4. Under **Network Access**, allow your IP — or `0.0.0.0/0` (allow from
   anywhere) if you're not sure your server's IP will stay fixed, which is
   common on most hosting platforms.
5. Click **Connect** → **Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`

## 3. Configure

```
copy .env.example .env        (Windows)
cp .env.example .env          (Mac/Linux)
```

Open `.env` and fill in:

- `MONGODB_URI` — the connection string from step 2, with your real username
  and password swapped in.
- `JWT_SECRET` — any long random string.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your admin login. Created automatically the
  first time the server starts. **Change the default password before sharing
  this with anyone.**
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — free test-mode keys from
  https://dashboard.razorpay.com → Settings → API Keys. Test mode simulates
  payments with dummy card/UPI numbers — no real money moves until you switch
  to live keys after Razorpay verifies your business (KYC).
- `ANTHROPIC_API_KEY` — from https://console.anthropic.com → API Keys. Only
  needed for the support chatbot; everything else works without it.
- `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`/etc — for real password-reset and
  verification emails. See the comments in `.env.example`.

## 4. Run

```
npm run dev
```

You should see:

```
Connected to MongoDB Atlas.
Seeded admin account -> admin@testmandi.in (password from .env)
TestMandi API listening on http://localhost:4000
```

Your data now lives in MongoDB Atlas — view and edit it any time from Atlas's
web dashboard under Collections. Atlas handles backups on paid tiers; on the
free M0 tier, there's no automatic backup, so treat it accordingly if you're
storing anything you can't afford to lose.

## Auth model

- **Access token** (`token` in responses) — short-lived (15 min), sent as
  `Authorization: Bearer <token>` on every authenticated request.
- **Refresh token** — long-lived (30 days), stored hashed in the database.
  Call `POST /api/auth/refresh` with it to get a new access token; it rotates
  (the old refresh token is invalidated) each time. Call
  `POST /api/auth/logout` with it to invalidate it early (e.g. on sign-out).
- **Email verification** — every new account gets a verification link. Since
  no real email provider is wired up, the "email" is printed to the server
  console (`--- simulated email ---`) instead of actually being sent. Swap
  `sendSimulatedEmail()` in `index.js` for a real provider (Resend, SendGrid,
  Postmark, SES) before this goes near real users. Login is **not** blocked on
  verification in this build — add that check yourself if you want it stricter.
- **Password reset** — `POST /api/auth/forgot-password` (always returns a
  generic success message, so it can't be used to check which emails exist)
  and `POST /api/auth/reset-password` with the token from the (simulated)
  email. Resetting a password logs the account out everywhere by clearing all
  its refresh tokens.
- **Rate limiting** — a generous global limit (600 req / 15 min / IP), a
  tighter one on auth + payment endpoints (20 req / 15 min / IP), and a
  separate one on the chatbot (30 messages / 10 min / IP) to control API cost.

## What this does and doesn't include

**Included:** password hashing (bcrypt), short-lived access tokens + rotating
refresh tokens (JWT + stored hashes), email verification and password reset
(simulated email, real token logic), rate limiting, a real database file,
Razorpay order creation + payment signature verification, purchase/attempt/
payout/ad records that survive a server restart, and a `/api/chat` endpoint
that calls Claude with your API key kept server-side.

**Not included, on purpose, since they need decisions only you can make:**
- Actually calling these endpoints from the React app — the frontend
  (`testmandi.jsx`) still runs entirely on in-browser state. Wiring it to this
  API (swapping `useState` for `fetch` calls, and the simulated checkout modal
  for real Razorpay Checkout.js) is the next step — ask and I'll do it.
- A real email provider — see "Email verification" above.
- HTTPS/production hosting — this is built for local development. Deploying it
  (Render, Railway, a VPS, etc.) needs its own setup pass.
- Real seller payouts — `/api/payouts/withdraw` simulates a transfer locally.
  Actually moving money to a seller's bank account needs a payout API (e.g.
  RazorpayX Payouts) and your business's KYC/compliance sign-off — that's a
  business step, not just code.
## Quick endpoint reference

| Method | Path | Who | What |
|---|---|---|---|
| POST | /api/auth/register | anyone | create a buyer, seller, or advertiser account |
| POST | /api/auth/login | anyone | log in (admin login passes `expectedRole: "admin"`) |
| POST | /api/auth/refresh | anyone with a refresh token | get a new access token |
| POST | /api/auth/logout | anyone | invalidate a refresh token |
| POST | /api/auth/verify-email | anyone with a verification link | confirm email address |
| POST | /api/auth/forgot-password | anyone | request a password reset link |
| POST | /api/auth/reset-password | anyone with a reset link | set a new password |
| GET | /api/auth/me | logged in | fetch your own account |
| GET | /api/categories | anyone | list exam categories |
| POST/DELETE | /api/categories | admin | add/remove a category |
| GET | /api/tests | anyone | marketplace listing (blocked tests excluded) |
| GET | /api/tests/mine | seller | seller's own tests |
| POST | /api/tests | seller | publish a new test |
| POST | /api/tests/:id/rate | buyer | rate a purchased test |
| POST | /api/checkout/create-order | buyer | create a Razorpay order |
| POST | /api/checkout/verify | buyer | verify payment + record purchase |
| GET | /api/purchases/mine | buyer | buyer's purchase history |
| POST | /api/attempts | buyer | submit a completed test attempt |
| GET | /api/attempts/mine | buyer | buyer's attempt history |
| POST | /api/payouts/bank | seller | save bank details |
| GET/POST | /api/payouts/mine, /withdraw | seller | check balance / withdraw |
| GET/POST | /api/notifications | any / admin | read / send marketing notifications |
| GET/DELETE | /api/admin/accounts | admin | list / remove accounts |
| GET | /api/admin/overview | admin | platform-wide stats |
| POST | /api/chat | anyone | support chatbot (needs ANTHROPIC_API_KEY) |

