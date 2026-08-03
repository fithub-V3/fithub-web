# Fithub — Known issues / follow-ups

Running list of things flagged during development but deliberately deferred. Not urgent for MVP unless noted, but shouldn't be forgotten.

## Backend

- [ ] `ExerciseService.DeleteAsync` doesn't handle the FK `Restrict` failure when an exercise is still referenced by a `WorkoutExercise`. Currently throws an unhandled DB exception instead of a clean error message (e.g. "can't delete — used in 2 workouts").
- [ ] `WorkoutService.CreateAsync`/`UpdateAsync` do an extra round-trip (`GetByIdAsync` after save) to get a fully-hydrated object graph for the response DTO. Fine for MVP; could be optimized later.
- [ ] `WorkoutService.ValidateExerciseOwnershipAsync` re-fetches *all* the user's exercises just to check membership of a few IDs. Fine at small scale; could become a targeted "do these IDs exist for this user" query if the exercise list grows large.
- [ ] `Workout`'s soft-delete query filter vs. non-nullable FKs on `Schedule`/`WorkoutExercise` — EF Core startup warning, not yet resolved. Options: make those FKs nullable, or add matching soft-delete filters to them too.

## Auth / tokens (web + mobile)

- [ ] No handling for expired access tokens. A 401 from an expired token currently just fails silently/confusingly. Needs a decision: (a) auto-refresh via the existing `POST /auth/refresh` flow when a request 401s, or (b) detect the 401 and redirect to `/login` with a "session expired" message. Applies to both `authorizedFetch` in web's `auth-client.ts` and mobile's `api-client.ts` — ideally one shared strategy so the two don't drift.
- [ ] Auth tokens still in `localStorage` on web. httpOnly cookies is the real fix — also blocks route-protection middleware (see below), since middleware can't read `localStorage`.

## Web

- [ ] `login/page.tsx` uses `router.push` instead of `router.replace` for the post-login redirect — back button currently returns to the login page.
- [ ] No client-side (or middleware) route protection for `/exercises`, `/workouts`, etc. — nothing stops direct URL access while logged out. Deferred until the httpOnly cookie migration (see above).
- [ ] Grid/List toggle from the exercises mockup isn't implemented — grid view only.
- [ ] "Import starter set" button from the exercises empty-state mockup isn't implemented.

## Mobile

- [ ] Exercises list screen (`index.tsx`) doesn't refresh when navigating back from create/edit. Needs `useFocusEffect` (from `@react-navigation/native`) instead of a mount-only `useEffect`.
- [ ] Tab bar icons for Plan / Train / Progress / More are reusing the leftover `explore.png` starter template asset — need real icons.
- [ ] `Today`, `Plan`, `Progress`, `More` screens are all placeholder "coming soon" stubs — no real design/functionality yet.
- [ ] Various `as any` casts on `router.push` calls for routes that don't exist yet (e.g. `/workouts` from the Train hub). Remove once those screens are built.

## Explicitly out of scope (not bugs, just noting)

- FastAPI ML microservice — not started, correctly deferred until MVP is done.
- Pose estimation — deferred even further, post-dissertation.
- `WorkoutLog` / `SetLog` ("actually performed" workout data) — separate feature, not started. Template CRUD (`Workout`/`WorkoutExercise`) is done first.
