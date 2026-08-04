# Chuột shop Wallet Shop — Cloudflare Pages

Chuột shop is a full-stack JavaScript app for Cloudflare Pages and worker:

- Frontend: plain HTML, CSS and browser JavaScript in `public/`
- Backend: Cloudflare Pages Functions in `functions/`
- Shared server logic: `src/lumen.js`
- Storage: Sanity Content Lake
- Login: Google OAuth 2.0
- Payments: Pay2S Collection Link + IPN + Partner Webhook

Local development requires Node.js 22+ because the pinned Wrangler release uses the current Workers toolchain.

## Local development

1. Copy `.dev.vars.example` to `.dev.vars` and fill the values.
2. Install the pinned Wrangler version:

```powershell
npm.cmd install
```

3. Start Pages locally:

```powershell
npm.cmd run dev
```

The local site runs at `http://localhost:8788`.

Run the same local smoke test used during development:

```powershell
npm.cmd run test:local
```

The test starts Wrangler, checks the static page, `/api/config`, and the unauthenticated `/api/me` response, then cleans up the local process.

## Deploy to Cloudflare Pages

### Option 1: Deploy via Wrangler CLI

```powershell
npm.cmd run deploy
```

This runs `wrangler pages deploy public` — the correct command for **Pages** projects.

> ⚠️ **Important:** Do NOT use `npx wrangler deploy` — that command is for **Workers**, not Pages. This project is a Pages project (it has `pages_build_output_dir` in `wrangler.toml` and uses `functions/` for Pages Functions).

### Option 2: Connect repository in Cloudflare Pages dashboard

When connecting this repository in **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**, configure:

- **Framework preset:** None
- **Build command:** `npm run build`
- **Build output directory:** `public`
- **Root directory:** (leave empty)
- **Environment variables:** Add the same names as in `.dev.vars` (see below)

> ⚠️ **Do NOT set the deploy command to `npx wrangler deploy`.** Cloudflare Pages automatically builds and deploys the `public/` directory. The `build` script (`exit 0`) simply confirms the build step succeeds.

`wrangler.toml` is already configured with `pages_build_output_dir = "./public"`.

## Environment variables

For local development use `.dev.vars`. For Cloudflare production and preview deployments, add the same names under Pages → Settings → Variables and Secrets. Keep all key material server-side; none of these values are exposed to the browser.

Required groups:

```env
SESSION_SECRET=long-random-secret

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://your-pages-domain.pages.dev/auth/google/callback

SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_TOKEN=

PARTNER_CODE=
ACCESS_KEY=
SECRET_KEY=
API_TAO_GIAO_DICH=https://payment.pay2s.vn/v1/gateway/api/create
STK_BANK_ACCOUNTS=
PAY2S_WEBHOOK_TOKEN=
```

The Pay2S names above match the variables used in the provider sample. The backend also accepts the equivalent `PAY2S_*` names if you prefer them.

Use `https://sandbox-payment.pay2s.vn` during Pay2S testing. Register these public endpoints with Pay2S:

- IPN: `https://your-domain/api/pay2s/ipn`
- Partner Webhook: `https://your-domain/api/pay2s/webhook`

The app verifies Pay2S IPN `m2signature`, matches the received amount to the pending deposit, and uses a deterministic ledger id to prevent duplicate credits from retried notifications.

Sanity documents are created on demand:

- `lumenUser` — Google profile and wallet balance
- `lumenDeposit` — pending/paid Pay2S deposits
- `lumenTransaction` — wallet ledger entries
- `lumenPurchase` — packages bought with web balance

## Cloudflare note

This project no longer uses a Node HTTP server. Cloudflare Pages serves `public/` as static assets and invokes only the API/auth routes listed in `public/_routes.json`. Pages Functions read secrets from `context.env`, so the app is compatible with the Workers runtime.
