# Rocket Explorer · SpaceX

A responsive two-screen web app that displays SpaceX rockets from the
[Launch Library 2 API](https://thespacedevs.com/llapi) by The Space Devs:
a **rocket list screen** (with filter + add) and a **rocket detail screen**.

## Features

- **Rocket list** — card grid showing each rocket's image, name, and description
- **Filter** — text search, family dropdown, active-only toggle, and sorting
  (name, cost per launch, first flight), with one-click filter reset
- **Add rocket** — validated dialog; new rockets appear instantly at the top of
  the list (the API is read-only, so they live in app state only)
- **Rocket detail** — image, name, description, cost per launch, country, and
  first flight, plus family, variant, status, reusability, and manufacturer
- **UI states** — skeleton loaders while fetching, error view with **Retry**
  button on failure, success view, and an empty state when filters match nothing
- **Missing-data safe** — rockets without `image_url`, `launch_cost`,
  `maiden_flight`, or `description` still render correctly with placeholders
  (e.g. Starship V3 has no image or launch cost in the API)

## Tech Stack & Libraries

| Category            | Library / Tool                                      |
| ------------------- | --------------------------------------------------- |
| Framework           | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| UI kit              | [Vuetify 3](https://vuetifyjs.com/) (Material components, dark theme) |
| Styling             | SCSS via `sass` / `sass-embedded` (scoped `lang="scss"` + shared partials) |
| Routing             | `vue-router` + `unplugin-vue-router` (file-based routes in `src/pages`) |
| State management    | [Pinia](https://pinia.vuejs.org/) (`src/stores/rockets.ts`) |
| HTTP                | Native `fetch` wrapper (`src/services/rocketApi.ts`) |
| Build               | [Vite 5](https://vitejs.dev/) + `vite-plugin-vuetify` |
| Language / checks   | TypeScript, `vue-tsc`, ESLint |

## API

Base host for development: `https://lldev.thespacedevs.com`
(same data as production, far more generous rate limit).

```text
GET /2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20
GET /2.2.0/config/launcher/:id/
```

`mode=detailed` is required (otherwise `description` and detail fields are
omitted); `limit=20` is required (default page size is 10, but there are
13 SpaceX rockets). API version `2.2.0` field mapping:

| Shown as        | Field                       |
| --------------- | --------------------------- |
| rocket image    | `image_url`                 |
| rocket name     | `full_name`                 |
| description     | `description`               |
| cost per launch | `launch_cost`               |
| country         | `manufacturer.country_code` |
| first flight    | `maiden_flight`             |

## Prerequisites

- **Node.js 18+** (LTS recommended) and **npm**
- Internet access (rocket data is fetched live from the API above)

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:3000)
npm run dev
```

Open `http://localhost:3000` — the list screen loads automatically.
Click any card (or **View details**) to open `/rockets/:id`.

## Build & Preview

```bash
# Production bundle (dist/)
npm run build-only

# Serve the production bundle locally for a final check
npm run preview
```

| Script       | What it does                              |
| ------------ | ----------------------------------------- |
| `npm run dev`        | Start Vite dev server on port 3000 |
| `npm run build`      | Type-check (`vue-tsc`) + production build |
| `npm run build-only` | Production build only (`vite build`) |
| `npm run preview`    | Serve `dist/` locally |
| `npm run type-check` | Type-check without emitting |
| `npm run lint`       | ESLint with auto-fix |

> Note: `npm run build` runs the scaffold's `type-check` step, which reports
> a few pre-existing errors from the template toolchain (`@tsconfig/node22`
> lib options and the `vue-router/auto` type shim). They exist on the pristine
> template too and don't affect the app — `vite build` itself succeeds and is
> what produces `dist/`.

## Project Structure

```text
├── components.d.ts        # auto-generated (unplugin-vue-components) — keep at root, do not edit
├── typed-router.d.ts      # auto-generated (unplugin-vue-router) — keep at root, do not edit
├── index.html
├── src/
│   ├── main.ts            # app bootstrap (+ global styles import)
│   ├── App.vue            # shell: header, router-view, footer
│   ├── assets/            # static assets
│   ├── components/
│   │   ├── AppHeader.vue       # top bar with brand + rocket count
│   │   ├── RocketCard.vue      # list item: image, name, description, chips
│   │   ├── RocketFilterBar.vue # search + family + active + sort
│   │   ├── AddRocketDialog.vue # validated "add rocket" form
│   │   ├── RocketImage.vue     # image with missing/broken fallback
│   │   ├── DetailField.vue     # label/value row for the detail screen
│   │   ├── LoadingGrid.vue     # skeleton cards for the loading state
│   │   └── StateMessage.vue    # error/retry + empty-state view
│   ├── pages/
│   │   ├── index.vue           # route `/` — rocket list screen
│   │   └── rockets/[id].vue    # route `/rockets/:id` — detail screen
│   ├── plugins/
│   │   ├── index.ts       # registers Pinia, Vuetify, router
│   │   └── vuetify.ts     # Vuetify instance (dark theme)
│   ├── router/
│   │   └── index.ts       # file-based routes (vue-router/auto)
│   ├── services/
│   │   └── rocketApi.ts   # Launch Library 2 fetch wrappers
│   ├── stores/
│   │   └── rockets.ts     # Pinia store: rockets, filters, statuses, local adds
│   ├── styles/
│   │   ├── settings.scss  # Vuetify SASS config (wired in vite.config.mts)
│   │   ├── main.scss      # global app styles (smooth scroll, selection)
│   │   ├── _variables.scss# shared SCSS tokens (transitions, sizes)
│   │   └── _mixins.scss   # shared SCSS mixins (e.g. line-clamp)
│   ├── types/
│   │   └── rocket.ts      # Rocket / filter / status types
│   └── utils/
│       └── format.ts      # name/description/cost/date formatters + fallbacks
└── vite.config.mts        # Vite + Vuetify + router + components plugins
```

## How It Works

- **Routing** — file-based: `src/pages/index.vue` → `/`,
  `src/pages/rockets/[id].vue` → `/rockets/:id`. Cards navigate via
  `router.push('/rockets/' + id)`.
- **State management** — the `rockets` Pinia store owns the rocket list, the
  detail cache, the filter object, and `loading | success | error` statuses.
  Locally-added rockets get a `local-*` id and are prepended to API results,
  so they work with filtering, sorting, and the detail screen.
- **Lifecycles** — the list fetches on `onMounted` (once); the detail screen
  fetches on mount and re-fetches whenever the route `id` changes.
- **UI states** — `LoadingGrid` skeletons while waiting, `StateMessage` with a
  **Retry** button on errors, live result counts on success.

## Notes & Caveats

- The Launch Library API is **read-only**: rockets added via the dialog persist
  only for the running session (in-memory Pinia state).
- Always use the `lldev.thespacedevs.com` host during development — the
  production host throttles anonymous users to ~15 requests/hour.
- `components.d.ts` and `typed-router.d.ts` are plugin-generated type shims;
  the generator headers ask you to commit them, and root is their default (and
  documented) location — see `vite.config.mts`.
