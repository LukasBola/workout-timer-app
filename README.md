# Interval Timer

A fullstack interval training application built with React + TypeScript on the frontend and Node.js + Express + TypeScript on the backend.

## Overview

The app lets you configure workout rounds with custom durations and break periods, then run a guided timer with audio cues. Workout presets are saved to and loaded from a REST API backend.

## Prerequisites

- Node.js 18 or later
- npm 9 or later

## Installation

Install all dependencies for the root workspace, backend, frontend, and e2e packages in one command:

```bash
npm run install:all
```

This runs `npm install` in the root, `backend/`, `frontend/`, and `e2e/` directories.

## Running in Development

### Both frontend and backend together

```bash
npm run dev
```

This starts both servers concurrently:
- Backend on http://localhost:3001
- Frontend on http://localhost:5173

### Backend only

```bash
npm run dev:backend
```

### Frontend only

```bash
npm run dev:frontend
```

> The frontend Vite dev server proxies `/api` requests to `http://localhost:3001`, so the backend must be running for preset features to work.

## Building for Production

```bash
npm run build
```

Compiles the backend TypeScript to `backend/dist/` and bundles the frontend to `frontend/dist/`.

## Running Tests

### Jest unit + integration tests (backend)

```bash
npm run test:backend
```

Runs two test suites:
- `backend/tests/presetService.test.ts` — unit tests for the service layer
- `backend/tests/presetController.test.ts` — integration tests for the REST API using supertest

### Playwright e2e tests

> Requires both the backend and frontend dev servers to be running first.

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run test:e2e
```

Run only API tests:

```bash
npm run test:e2e -- --project=chromium tests/api
```

Run only UI tests:

```bash
npm run test:e2e -- --project=chromium tests/ui
```

## Project Structure

```
timer-app/
  package.json           Root workspace scripts
  README.md
  backend/
    package.json
    tsconfig.json
    src/
      types/preset.ts          Preset and DTO type definitions
      models/presetStore.ts    In-memory storage (singleton Map)
      services/presetService.ts Business logic layer
      controllers/presetController.ts  HTTP request handlers
      routes/presets.ts        Express router
      middleware/validation.ts Input validation middleware
      app.ts                   Express app setup
      server.ts                HTTP server entry point
    tests/
      presetService.test.ts    Service unit tests
      presetController.test.ts API integration tests (supertest)
  frontend/
    package.json
    tsconfig.json
    vite.config.ts             Vite config with /api proxy
    index.html
    src/
      types/timer.ts           Timer phase, settings, and state types
      types/preset.ts          Preset types (mirrors backend)
      hooks/useIntervalTimer.ts Core timer logic as a custom hook
      hooks/useSound.ts        Web Audio API sound generation
      api/presets.ts           Fetch wrapper for preset API
      components/
        TimerDisplay.tsx       Phase label, round counter, time display
        TimerControls.tsx      Start / Pause / Resume / Reset buttons
        TimerSettingsForm.tsx  Workout / break / rounds / prep inputs
        PresetList.tsx         Save, load, and delete presets
      App.tsx                  Root component wiring everything together
      App.css                  Dark-theme responsive stylesheet
      main.tsx                 React DOM entry point
  e2e/
    package.json
    playwright.config.ts
    tests/
      api/presets.spec.ts      Playwright API tests against the REST endpoints
      ui/timer.spec.ts         Playwright UI tests for timer interactions
```

## Architecture Notes

### Timer runs on the frontend

All countdown logic lives in the `useIntervalTimer` custom hook. A `setInterval` fires every second and updates the phase (`idle`, `preparing`, `work`, `break`, `completed`), the current round, and the time remaining. Using a `ref` for the live state prevents stale closures inside the interval callback.

### Presets are managed by the backend

The Express backend exposes a simple CRUD REST API at `/api/presets`. Data is stored in an in-memory `Map`. To swap to a real database, replace `presetStore.ts` with an implementation that satisfies the same interface — no other files need to change.

### Audio uses the Web Audio API

`useSound.ts` generates beep tones and a completion fanfare entirely via the browser's Web Audio API — no audio files or third-party libraries required. Sounds are triggered for the final-seconds countdowns in each phase and for workout completion.

### Validation

- **Backend**: `middleware/validation.ts` validates incoming POST bodies and returns structured `{ errors: [...] }` responses with HTTP 400.
- **Frontend**: `TimerSettingsForm.tsx` validates inputs inline and disables applying invalid values.
