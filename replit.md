# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

---

## WishMe Mobile App (Standalone)

A standalone Expo React Native project lives at `mobile/`. It is NOT part of the pnpm workspace — it has its own `package.json` and installs dependencies only inside `mobile/node_modules`.

The full project is also pushed to: https://github.com/Prashant-Patole/WishMeFinal.git

### Stack
- **Expo SDK**: 54
- **React Native**: 0.81.5
- **React**: 19.1.0
- **Router**: expo-router ~6.0.17
- **Styling**: Custom theme system (ThemeContext, lightColors/darkColors)
- **Auth**: Local AsyncStorage-based AuthContext (API integration pending)
- **Navigation**: Expo Router with (auth)/, (tabs)/, and direct route screens

### Structure
```
mobile/
├── app/                      # Expo Router screens
│   ├── _layout.tsx           # Root layout — NO KeyboardProvider (release build safe)
│   ├── (auth)/               # Auth flow: login, signup, OTP, plan selection
│   ├── (tabs)/               # Tab navigator: home, celebrities, music, profile, voice-call
│   ├── booking/[id].tsx      # Dynamic booking screen
│   ├── celebrity/[id].tsx    # Celebrity profile
│   ├── chat/[id].tsx         # Chat screen
│   └── ...                   # wallet, referrals, loved-ones, photo-wish, etc.
├── components/               # Shared UI: DrawerMenu, ErrorBoundary, Icon, OnboardingSplash, ui/
├── contexts/                 # AuthContext, DrawerContext, ThemeContext
├── constants/                # colors.ts, fonts.ts, theme.ts
├── assets/                   # fonts (Feather.ttf), images, splash screens, videos
├── android-signing-templates/ # Gradle signing config templates for release APK
├── package.json              # standalone deps, main=expo-router/entry
├── app.json                  # newArchEnabled=true, reactCompiler=false
├── babel.config.js           # api.cache(false)
├── metro.config.js           # unstable_enablePackageExports + resolveRequest
└── tsconfig.json             # expo base, @/* path alias
```

### Known Config Fixes Applied
| File | Fix | Reason |
|------|-----|--------|
| `app.json` | `newArchEnabled: true` | Required by reanimated/worklets |
| `app.json` | `reactCompiler: false` | Prevents useMemoCache crash in release |
| `babel.config.js` | `api.cache(false)` | Prevents stale transforms in release |
| `metro.config.js` | `unstable_enablePackageExports: true` | Fixes expo-router/entry resolution |
| `metro.config.js` | `resolveRequest` hook | Forces single react/react-native instance |
| `app/_layout.tsx` | No KeyboardProvider | Crashes Android release builds |

### Building Release APK (Windows)
1. `npm install` inside `mobile/`
2. `npx expo prebuild --platform android --clean`
3. Apply `android-signing-templates/gradle.properties.template` → `android/gradle.properties`
4. Apply `android-signing-templates/build.gradle.signing.template` → `android/app/build.gradle`
5. Copy `my-release-key.jks` into `android/app/`
6. `cd android && .\gradlew assembleRelease --rerun-tasks`
7. APK at: `android\app\build\outputs\apk\release\app-release.apk`

Keystore alias: `my-key-alias` | Password: `aseas@#`
