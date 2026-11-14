# Features

A running log of fithub features: what's shipped, what's being built, and what could come next.
Covers the whole monorepo: `apps/web` (Next.js), `apps/mobile` (Expo), `services/api` (ASP.NET Core + EF Core/Postgres), `services/ml` (FastAPI).

Known bugs and deferred clean-ups live in [fithub-todo.md](fithub-todo.md), not here.

_Last reviewed: 2026-11-14 (state of `main` @ `4e1a4f2` plus open branches)._

## How to use this doc

- Move an item to **In Development** when you start work, and to **Done** once it's merged to `main`.
- Add new ideas to **Future** as soon as they come up, even half-formed.
- Keep entries short. Link to branches or PRs instead of copying detail here.

Legend: **API** = backend · **Web** = Next.js app · **Mobile** = Expo app

---

## ✅ Done

| Feature | API | Web | Mobile | Notes |
|---|:-:|:-:|:-:|---|
| **Auth: register / login** | ✅ | ✅ | ✅ | `POST /auth/register`, `/auth/login`. BCrypt password hashing, JWT access tokens. Login/register pages restyled to match the designs. |
| **Auth: refresh tokens + logout** | ✅ | — | — | `POST /auth/refresh`, `/auth/logout`, with refresh tokens stored in the DB. The clients don't call refresh yet (see todo). |
| **Auth rate limiting + CORS** | ✅ | — | — | Fixed-window limiter on the auth endpoints; `AllowFrontend` CORS policy. |
| **Exercise Bank (CRUD)** | ✅ | ✅ | ✅ | `GET/POST/PUT/DELETE /exercises`. Name, muscle group, equipment. Web: grid page plus new/edit modals and a delete button. Mobile: list screen plus new/edit modals. It's the default page after login. |
| **Workout Bank + builder (CRUD)** | ✅ | ✅ | ✅ | `GET/POST/PUT/DELETE /workouts`. Workouts are ordered lists of exercises, each with target sets and reps. Deleting a workout is a soft delete (`DeletedAt`). The API checks that every exercise in a workout belongs to the user. Web: list, `/workouts/new`, `/workouts/[id]/edit`. Mobile: list, new/edit modals, "Add from bank" sheet. |
| **Week planner: backend** | ✅ | — | — | `GET/POST/PUT/DELETE /schedules`. Assigns a workout to a day of the week (0 = Sun … 6 = Sat), with ownership and day validation (PR #7). |
| **Landing / marketing page** | — | ✅ | — | Navbar, hero banner, feature cards (exercise library, workouts, week planner, training with friends). |
| **Dashboard shell** | — | ✅ | ✅ | Web: sidebar navbar (Today, Exercises, Workouts, Planner, Train; Nutrition/Analytics/Community shown as disabled). Mobile: tab bar (Today, Plan, Train, Progress, More) and a Train hub screen. |
| **Data model** | ✅ | — | — | EF Core entities and migrations for Users, Exercises, Workouts, WorkoutExercises, Schedules, WorkoutLogs, SetLogs, RefreshTokens. |

---

## 🚧 In Development

| Feature | Where | Status | Branch | Notes |
|---|---|---|---|---|
| **Week planner: web UI** | Web | Early scaffold | `week-planner-web` | `/planner` page fetches schedules through a new `planner-client.ts`. The layout is hard-coded (one Monday column, fixed dates and totals); the workout-bank sidebar and drag/assign aren't built yet. |
| **Week planner: mobile UI** | Mobile | Not started | — | The `Plan` tab is a "coming soon" stub. |
| **Workout tracker / logging: backend** | API | In progress, not merged | `workout-track` | WorkoutLogs controller (`GET`, `GET /{id}`, `POST`, `DELETE`), service, repository, and DTOs. Adds a migration `AddWorkoutLogSetLogAndTargetWeight`, which adds target weight to WorkoutExercise. On `main` the `WorkoutLogs*` files exist but are empty. |
| **Workout tracker: active session UI** | Web + Mobile | Not started | — | `/train` is linked in the web navbar but has no page. The mobile Train hub links only to exercises and workouts. |
| **Workout history** | Web + Mobile | Placeholder only | — | Web `/history` page file exists but is empty. Mobile `Progress` tab is a stub. Depends on workout logging. |
| **Profile page** | Web | Placeholder only | — | `/profile/page.tsx` exists but is empty. |
| **Today / home screen** | Web + Mobile | Placeholder only | — | Linked in both navs (`/today` on web, `Today` tab on mobile). Neither has content yet. |

---

## 🔮 Future

### Core MVP gaps (needed to finish the existing features)

| Feature | Why |
|---|---|
| System / starter exercises | `Exercise.CreatedById = null` is already reserved for system exercises, but the repository only returns the user's own exercises and nothing is seeded. This would also power the "Import starter set" button from the empty-state mockup. |
| Session expiry handling | Auto-refresh on a 401 using the existing `/auth/refresh` endpoint, or redirect to login. One shared strategy for web and mobile. |
| httpOnly cookie auth + route protection | Move tokens out of `localStorage` so Next.js middleware can protect the dashboard routes. |
| Grid/list toggle on exercises | Shown in the exercises mockup but not built. |
| Real mobile tab icons | The tabs still use the starter template's `explore.png`. |
| Shared types package | `packages/shared-types` is scaffolded but unused. Web and mobile each have their own API clients and types. |

### Features already sketched in the UI (navbar, marketing copy)

| Feature | Description |
|---|---|
| **Social presence & join layer** | "Train with friends": see when friends are training and join their sessions. Listed as High priority in the original plan. |
| **Community** | Feed, sharing workouts or templates, following friends. Disabled in the web navbar. |
| **Analytics / progress** | Volume per muscle group, PRs, estimated 1RM, streaks, and charts built from SetLogs. Disabled in the web navbar. |
| **Nutrition** | Calorie and macro tracking. Disabled in the web navbar. |
| **"A week that plans itself"** | Auto-suggest a weekly schedule from goals and available days. Promised in the marketing copy. |

### Longer-term ideas

| Idea | Description |
|---|---|
| ML service (`services/ml`) | FastAPI service scaffolded with `model.py` and training stubs, but empty. Could handle progression or weight recommendations and recovery or fatigue prediction. Deferred until after the MVP. |
| Pose estimation / form checking | Camera-based rep counting and form feedback. Deferred until after the dissertation. |
| Progressive overload suggestions | Suggest the next session's target weight and reps from the last log. Uses the new `TargetWeight` field. |
| Rest timer & RPE prompts | During an active session. `SetLog.Rpe` already exists in the schema. |
| Ad-hoc workouts | Log a session without a saved template. The schema already allows `WorkoutLog.WorkoutId = null`. |
| Workout templates marketplace | Import pre-built programs (PPL, 5×5, etc.). |
| Offline mode (mobile) | Log sets without a connection and sync later. |
| Notifications | Reminders for scheduled workouts, and alerts when a friend starts a session. |
| Wearables / Health integrations | Apple Health, Google Fit. |
| Data export | CSV or JSON export of the user's training history. |

---

## Dropped

| Feature | Why dropped |
|---|---|
| — | Nothing dropped yet |
