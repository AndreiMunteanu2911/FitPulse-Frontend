# FitPulse Frontend

Next.js web interface and Capacitor Android shell for FitPulse.

[Open the live app](https://fitpulseam.vercel.app) | [Android releases](https://github.com/AndreiMunteanu2911/FitPulse-Workout-Tracker/releases)

This repository is intentionally frontend-only. Authentication operations, Supabase queries, migrations, authorization, business calculations, Stripe secrets, webhooks, AI calls, and admin enforcement live in the separate FitPulse Backend repository.

## Features

- Workout creation, live set logging, rest timers, history, and templates.
- Exercise search, favorites, custom exercises, and progress statistics.
- Camera-based MediaPipe form feedback and form-session history.
- Weight logs, progress photos, personal records, dashboard metrics, XP, and achievements.
- AI coaching and generated workout drafts.
- Social posts, friends, comments, fitness articles, and a Stripe-backed shop.
- Admin interfaces for users, exercises, templates, form rules, content, products, orders, and analytics.
- Responsive web UI and a Capacitor Android wrapper.

## Architecture

```text
Browser or Capacitor WebView
        |
        | same-origin /api/*
        v
Next.js frontend rewrite
        |
        v
NestJS backend on Vercel
        |
        +-- Supabase Auth/Postgres/Storage
        +-- Stripe
        +-- OpenRouter
```

Frontend requests must use relative `/api/*` URLs. `next.config.ts` rewrites them to the backend configured by `API_URL`. This keeps session cookies on the frontend origin and means the browser never needs Supabase credentials.

### Frontend Responsibilities

- Pages, components, interaction state, charts, and responsive layout.
- Client validation for immediate feedback; the backend validates again.
- MediaPipe pose detection and real-time form feedback because video frames stay on-device.
- Display-only calculations over already-authorized API responses.
- Capacitor plugins and Android packaging.

### Backend Responsibilities

- All database and storage access, migrations, auth sessions, and role checks.
- Persisted workout mutations and authoritative workout completion.
- Volume, streak, records, achievement eligibility, and XP claims.
- Stripe Checkout, webhook verification, and order fulfillment.
- OpenRouter calls and AI persistence.
- Admin enforcement and server validation.

Camera-derived form scores originate in the browser and are stored as user-owned analytics. They are not trusted for permissions, rewards, payments, or cross-user decisions.

## Local Setup

Requirements: Node.js 22+, pnpm, and the FitPulse Backend running locally.

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

`.env.local`:

```env
CAP_APP_ENV=development
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_PRODUCTION_APP_URL=https://fitpulseam.vercel.app
CAP_ANDROID_DEV_SERVER_URL=http://10.0.2.2:3000
API_URL=http://localhost:3001
```

Open `http://localhost:3000`. The Android emulator reaches the local Next.js server through `http://10.0.2.2:3000`.

Do not add `SUPABASE_SERVICE_ROLE_KEY`, Stripe secrets, OpenRouter keys, or other backend credentials here. The frontend no longer imports a Supabase client.

## Environment Variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `API_URL` | Local and frontend Vercel | Server-side rewrite target for the Nest backend. Required in production. |
| `NEXT_PUBLIC_PRODUCTION_APP_URL` | Local, Vercel, GitHub variable | Canonical hosted frontend URL used by Capacitor/mobile navigation. Public. |
| `CAP_APP_ENV` | Local or APK workflow | `development` uses the emulator server; `production` packages the hosted shell. |
| `NEXT_PUBLIC_APP_ENV` | Local only | Optional matching web/mobile environment override. |
| `CAP_ANDROID_DEV_SERVER_URL` | Local only | Android emulator URL for the local Next server. |

`API_URL` is deliberately not `NEXT_PUBLIC_`; only Next.js build/runtime configuration needs the backend origin. Browser code calls relative `/api/*`.

## Deploy Frontend To Vercel

Create a separate Vercel project for this repository and set:

| Vercel variable | Production value | Preview guidance |
| --- | --- | --- |
| `API_URL` | `https://YOUR_BACKEND_DOMAIN` | Prefer a non-production backend/data environment. |
| `NEXT_PUBLIC_PRODUCTION_APP_URL` | `https://YOUR_FRONTEND_DOMAIN` | Use the production URL for mobile deep-link behavior. |

No Supabase, Stripe, or OpenRouter variables belong in the frontend Vercel project.

Deployment order:

1. Deploy the backend and copy its URL.
2. Set frontend `API_URL`, then deploy the frontend.
3. Set backend `WEB_APP_URL` and `FRONTEND_ORIGIN` to the final frontend URL.
4. Redeploy the backend and verify login, one authenticated API call, checkout redirect, and logout.

Vercel Git integration can deploy pushes without GitHub deployment secrets. Only a custom GitHub Actions Vercel deployment would need `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.

## Capacitor Android

The native project lives in `android/`; `capacitor-shell/` is the packaged web shell. In production the shell opens `NEXT_PUBLIC_PRODUCTION_APP_URL`, so it does not embed backend or Supabase credentials.

### Local Emulator

1. Start the backend on port `3001`.
2. Start this frontend with `pnpm dev`.
3. Run `pnpm exec cap sync android`.
4. Run `pnpm exec cap open android`.
5. Launch the `app` target from Android Studio.

For a physical device, replace `CAP_ANDROID_DEV_SERVER_URL` with your computer's LAN URL and allow that development origin only while testing.

### Existing APK Workflow

`.github/workflows/android-apk.yml` builds a debug APK and publishes it to GitHub Releases. Configure one frontend-repository GitHub Actions variable:

```text
NEXT_PUBLIC_PRODUCTION_APP_URL=https://YOUR_FRONTEND_DOMAIN
```

The current APK workflow requires no GitHub secrets:

- `GITHUB_TOKEN` is supplied automatically and `contents: write` permits release creation.
- Supabase values are not used by Capacitor and were removed from the workflow.
- `CAP_APP_ENV` is fixed to `production` in the workflow.

The produced APK uses Android's debug signing key. For Play Store or trusted release distribution, change the workflow to build a signed release/AAB and then add secrets such as `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD`. Do not create these until the YAML actually consumes them.

## Testing

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

Frontend tests cover components, hooks, stores, request handling, validation, navigation, and local pose/form analysis. API routes, backend business rules, and provider integrations are tested in the backend repository.

## Project Structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Next.js pages and layouts |
| `src/components/` | UI and form-checker components |
| `src/hooks/` | Client hooks that call `/api/*` |
| `src/services/api/` | Shared API response and auth handling |
| `src/lib/` | Browser/mobile utilities and local form analysis |
| `src/stores/` | Client-only Zustand state |
| `tests/` | Vitest frontend tests |
| `android/` | Native Android project |
| `capacitor-shell/` | Production Capacitor shell |
| `.github/workflows/android-apk.yml` | Debug APK release workflow |

Database migrations and backend route tests are intentionally absent; they live in FitPulse Backend.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Next.js locally |
| `pnpm build` | Build the web frontend |
| `pnpm start` | Run the production Next.js server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run frontend tests once |
| `pnpm test:watch` | Run frontend tests in watch mode |
| `pnpm test:coverage` | Generate frontend coverage |
| `pnpm exec cap sync android` | Sync Capacitor configuration/plugins |
| `pnpm exec cap open android` | Open Android Studio |

## Operational Notes

- Camera and pose tracking require camera permission and sufficient lighting.
- Checkout and authenticated requests rely on the hosted frontend and backend URLs being configured consistently.