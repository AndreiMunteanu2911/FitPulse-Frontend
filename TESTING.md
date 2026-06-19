# Testing

This repository uses Vitest with `jsdom` for frontend tests.

## Commands

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

## Test Layers

- `tests/components/**/*.test.tsx`: React component behavior.
- `tests/hooks/**/*.test.tsx`: client hooks and request behavior.
- `tests/services/**/*.test.ts`: shared API client behavior.
- `tests/stores/**/*.test.ts`: Zustand state transitions.
- `tests/lib/**/*.test.ts`: browser-side validation, navigation, and local camera/form analysis.
- `tests/config/**/*.test.ts`: frontend and Capacitor environment behavior.

MSW and mocked `fetch` responses isolate the UI from the deployed Nest API. Backend routes, Supabase queries, Stripe/OpenRouter integration code, migrations, XP, achievements, and other authoritative business logic are tested in the backend repository.

The suite does not use a real browser or Android WebView. Camera permissions, MediaPipe runtime behavior, Capacitor plugins, auth-cookie forwarding through the Vercel rewrite, and complete checkout flows require manual or dedicated end-to-end testing.
