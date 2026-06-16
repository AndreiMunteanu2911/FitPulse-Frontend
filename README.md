# FitPulse - Workout Tracker

<p align="center">
  <img src="public/assets/logo.png" alt="FitPulse logo" width="140" />
</p>

[Open the live app](https://fitpulseam.vercel.app)

Android APK builds are available on the [GitHub Releases page](https://github.com/AndreiMunteanu2911/FitPulse-Workout-Tracker/releases).

FitPulse is a mobile-first fitness app for planning workouts, logging training sessions, tracking progress, checking exercise form, and staying consistent over time. It brings workout tracking, body progress, AI coaching, achievements, social sharing, fitness content, and a small product shop into one place.

## What You Can Do With FitPulse

### Track every workout

FitPulse helps you record a workout while you train, not after you forget the details.

- Start a workout and add exercises as you go.
- Enter sets, reps, and weight for each movement.
- See previous numbers so you can compare today with your last session.
- Use rest timers between sets.
- Save completed workouts to your history.
- Reuse workout templates for routines you repeat often.
- Add custom exercises when the built-in library does not cover your movement.
- Share a completed workout to the social feed if you want others to see it.

### Build a personal exercise library

The exercise library is designed to help users find, understand, and reuse movements.

- Search for exercises.
- View exercise details, target muscles, and movement information.
- Mark favorite exercises for faster access.
- Review exercise-specific history and progress.
- Add personal custom exercises.

### Check your exercise form

FitPulse includes a camera-based form checker for supported exercises. It watches your movement, tracks body landmarks, and gives feedback based on the exercise pattern.

The goal is not to replace a coach. It is a training aid that can help users notice common issues such as incomplete range of motion, unstable movement, poor timing, or unsafe-looking reps.

After a set, the app can show:

- A form score.
- Main technique cues.
- Rep quality feedback.
- A short post-set review.
- Optional AI-assisted coaching feedback when the AI service is available.

### Follow your progress

FitPulse keeps training progress visible in more than one way.

- View workout history.
- Track body weight over time.
- Add progress photos with notes and body-area tags.
- See a calendar of training days.
- Review personal records.
- Watch your dashboard update as you log more activity.

### Stay consistent with achievements

The app includes a progression system to make consistency easier to notice.

- Earn XP from training activity.
- Level up over time.
- Unlock achievements for milestones such as workouts, streaks, records, and volume.
- Claim completed achievements.
- See achievement progress from the dashboard.

### Ask the AI coach

The AI coach can answer questions about your own training data and help you think through workouts, progress, and recovery.

Examples of what it can help with:

- Summarizing recent training.
- Explaining progress trends.
- Suggesting workout ideas.
- Creating a draft workout that can be started in the app.
- Continuing previous conversations instead of starting from zero each time.

AI features depend on the configured OpenRouter API key. If the AI service is unavailable, the rest of the app still works.

### Use the community features

FitPulse includes social features for users who want accountability or shared progress.

- Create posts.
- Share workouts.
- Like and comment on posts.
- Find and manage friends.
- See updates from other users.

### Read fitness content

The blog area gives users a place to read fitness-related posts published by admins.

- Browse articles.
- Open full posts.
- Like posts.
- Leave comments.

### Browse the shop

The shop lets users view fitness products and start a Stripe checkout flow.

- Browse available products.
- View product details and images.
- Enter shipping details.
- Complete checkout through Stripe.
- Return to FitPulse after payment.

### Admin tools

FitPulse also has admin-only areas for maintaining the platform.

- Manage exercises.
- Manage workout templates.
- Review and adjust form-checking rules.
- Manage users and roles.
- Publish blog posts.
- Manage shop products and orders.
- View basic platform analytics.

## Main App Areas

| Area | What it is for |
| --- | --- |
| Dashboard | A quick view of stats, shortcuts, XP, and recent progress |
| Workout | The active workout logger |
| History | Saved workouts and workout details |
| Exercises | Exercise search, favorites, details, and form checking |
| Profile | Personal stats, weight logs, progress photos, and calendar |
| Achievements | XP, levels, badges, and claimable milestones |
| AI Coach | Training chat and generated workout drafts |
| Social | Posts, friends, likes, comments, and workout shares |
| Blog | Fitness articles and comments |
| Shop | Product browsing and checkout |
| Admin | Platform management tools for trusted users |

## Who This App Is For

FitPulse is useful for people who want a simple way to keep their training organized, especially if they care about consistency and measurable progress. It is also useful for students, reviewers, or developers who want to inspect a full-stack fitness application with authentication, workout logging, AI features, media uploads, payments, and an Android wrapper.

You do not need to understand programming to use the hosted app. The technical sections below are only for people who want to run, modify, or review the project.

## Running the Project Locally

### What you need

To run your own local copy, you need:

- Node.js 18 or newer.
- A Supabase project for accounts, database records, and uploaded images.
- Stripe test keys if you want to test the shop checkout.
- An OpenRouter API key if you want to test AI coach features.
- Android Studio if you want to run the Android version.

### Install the app

```bash
git clone https://github.com/AndreiMunteanu2911/FitPulse-Workout-Tracker.git
cd FitPulse-Workout-Tracker
pnpm install
```

### Add environment variables

Copy `.env.example` to `.env.local`, then fill in your own values.

Important groups:

- Supabase values connect the app to the database, user accounts, and storage.
- Stripe values enable checkout and order handling.
- OpenRouter values enable AI chat and AI-assisted coaching.
- Capacitor values control whether the Android shell points to the local app or the hosted production app.

Example structure:

```env
CAP_APP_ENV=development
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_PRODUCTION_APP_URL=https://fitpulseam.vercel.app
CAP_ANDROID_DEV_SERVER_URL=http://10.0.2.2:3000

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_ALLOWED_SHIPPING_COUNTRIES=US,CA,GB,AU,DE,FR,NL,BE,ES,IT,PT,RO

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_CHAT_MODEL=qwen/qwen3-next-80b-a3b-instruct:free
```

### Prepare the database

Run the SQL files in `migrations/` in numeric order. They create the tables and policies used by the app.

The database covers:

- User profiles and roles.
- Exercises and custom exercises.
- Workouts, workout exercises, sets, templates, and personal records.
- Weight logs and progress photos.
- AI conversations and messages.
- Achievements and user achievement progress.
- Form analysis logs and form rules.
- Friends, posts, likes, and comments.
- Blog posts, blog likes, and blog comments.
- Shop products and orders.

### Create storage buckets

Create these Supabase Storage buckets:

- `progress-photos`
- `post-images`
- `blog-images`
- `product-images`

### Start the web app

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Android App

FitPulse includes a Capacitor Android project. Capacitor lets the web app run inside an Android app shell.

For local Android emulator development:

1. Start the web app with `pnpm dev`.
2. Sync the Android project with `pnpm exec cap sync android`.
3. Open the Android project with `pnpm exec cap open android`.
4. Run the `app` target from Android Studio.

Local Android development uses `CAP_ANDROID_DEV_SERVER_URL`, which normally points to `http://10.0.2.2:3000`. That address is how the Android emulator reaches the development server running on your computer.

For production builds, set the app environment to production and sync the Android project before building from Android Studio or your release pipeline. In production mode, the Android shell opens the hosted FitPulse app configured by `NEXT_PUBLIC_PRODUCTION_APP_URL`.

## Technical Overview

This section explains how the app is built. It is not required for regular users.

### Stack

| Layer | Technology |
| --- | --- |
| Web framework | Next.js App Router |
| Interface | React |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| AI provider | OpenRouter |
| Pose tracking | MediaPipe Tasks Vision |
| Payments | Stripe |
| Android wrapper | Capacitor |
| Language | TypeScript |

### Project structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Pages, layouts, and API routes |
| `src/components/` | Reusable interface pieces |
| `src/hooks/` | Reusable app logic for pages and components |
| `src/lib/` | Shared business logic, AI helpers, form analysis, navigation, and utilities |
| `src/services/` | Client-side API helpers |
| `src/stores/` | Shared client state |
| `migrations/` | Supabase database setup files |
| `public/assets/` | Public images and icons |
| `android/` | Native Android project |
| `capacitor-shell/` | Minimal shell used by the Android wrapper |
| `tests/` | Unit and integration tests |

### How the app is organized

- Public pages handle landing, login, signup, and onboarding.
- Protected pages require a signed-in user.
- Users who have not completed onboarding are kept inside the onboarding flow.
- Most browser actions call API routes instead of talking directly to the database.
- API routes handle database access, ownership checks, admin checks, AI calls, and payment operations.
- Supabase row-level security helps protect user-owned records.
- Admin-only features check the user's role before allowing management actions.
- The interface is responsive, with mobile navigation for small screens and a sidebar layout on larger screens.
- The Android app uses Capacitor to package the hosted or local web app inside a native shell.

### Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the Vitest test suite once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm form-rules:generate` | Generate form-rule data |
| `pnpm form-rules:import` | Import generated form-rule data |
| `pnpm exec cap sync android` | Sync web and Capacitor config into Android |
| `pnpm exec cap open android` | Open the Android project in Android Studio |

## Notes and Limitations

- The camera-based form checker needs camera access.
- Some camera and pose-tracking behavior may differ between desktop browsers, mobile browsers, and Android WebView.
- Form checking works best in a clear camera view with the whole body or required joints visible.
- AI features require an OpenRouter key and may be unavailable if the provider is slow, offline, or out of quota.
- Stripe checkout should be tested with Stripe test keys before using live payment keys.

## Credits

- Visual design inspired by the Figma community kit [Fitness App UI Kit for Gym Workout App Fitness Tracker Mobile App Gym Fitness Mobile App UI Kit](https://www.figma.com/community/file/1356281690251535631/fitness-app-ui-kit-for-gym-workout-app-fitness-tracker-mobile-app-gym-fitness-mobile-app-ui-kit?q_id=0140eb48-8ee5-4235-8c80-a350bca16cd2).
- Exercise data from [ExerciseDB](https://www.exercisedb.dev/docs).
- Icons from [Lucide](https://lucide.dev/).
- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), [Supabase](https://supabase.com/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Recharts](https://recharts.org/), [Stripe](https://stripe.com/), [MediaPipe](https://developers.google.com/mediapipe), and [Capacitor](https://capacitorjs.com/).
