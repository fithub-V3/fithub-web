# Fithub API — solution structure

`services/api` is organised as a clean architecture (onion architecture) solution: four projects, with dependencies only ever pointing inward toward `Domain`.

```
Api ──────────► Application ──────────► Domain ◄────────── Infrastructure
```

- `Domain` depends on nothing.
- `Application` depends only on `Domain`.
- `Infrastructure` depends only on `Domain`.
- `Api` depends on `Application` and `Infrastructure`.

`Domain` and `Application` never reference `Infrastructure`. This is enforced by project references, not just convention — there is no `.csproj` reference from `Domain` or `Application` to `Infrastructure`, so it's not possible to accidentally leak a database or framework concern into the core business logic.

## Fithub.Domain

The innermost layer. Contains entity classes and core business types only — nothing that depends on how the app is delivered (HTTP) or how data is stored (Postgres/EF Core).

**Contains:**
- Entities: `User`, `Exercise`, `Workout`, `WorkoutExercise`, `WorkoutLog`, `SetLog`, `Schedule`, `RefreshToken`
- Enums / value types shared across the domain

**Should not contain:** EF Core attributes or references, ASP.NET Core types, anything tied to a specific database or web framework.

**Why it's separate:** this is "what a workout *is*", independent of any technology choice. If the app were ever rebuilt with a different database or a different API framework, this project would not need to change.

## Fithub.Application

Business logic and use cases. Defines *what the app does*, expressed against interfaces rather than concrete implementations.

**Contains:**
- Services: `AuthService` (register/login/refresh logic)
- Interfaces the application layer needs from the outside world: `IPasswordHasher`, `IJwtService`, `IUserRepository`
- DTOs for requests/responses (e.g. register/login request and response shapes)

**Depends on:** `Domain` only. It does not know or care that `IPasswordHasher` is implemented with BCrypt, or that `IUserRepository` talks to Postgres — it only knows the shape of what it needs.

**Why it's separate:** this layer can be unit tested in isolation by mocking its interfaces — no database, no HTTP server, no BCrypt library needs to be loaded to test `AuthService`'s logic.

## Fithub.Infrastructure

The concrete implementations of everything `Application` asked for via interfaces. This is the "how".

**Contains:**
- `FithubDbContext` (EF Core) and entity configuration (`OnModelCreating`)
- Repository implementations (e.g. `UserRepository : IUserRepository`)
- Concrete `IPasswordHasher` implementation (wrapping BCrypt.Net-Next)
- Concrete `IJwtService` implementation
- `DependencyInjection.cs` — registers all of the above with the DI container via an `AddInfrastructure()` extension method

**Depends on:** `Domain` only (implements interfaces defined in `Application`, but does not have a project reference to `Application` itself — it fulfils the contract without depending on the layer that defined it).

**Why it's separate:** if the database or a specific library (e.g. swapping BCrypt for Argon2, or Postgres for something else) ever changed, only this project would need to change. `Domain` and `Application` — where the actual business rules live — would be untouched.

## Fithub.Api

The outermost layer. Receives HTTP requests and hands them off to `Application`. Owns startup/configuration concerns.

**Contains:**
- Controllers (e.g. `AuthController`)
- `Program.cs` — app startup, JWT bearer authentication wiring, rate limiting middleware, calls `AddInfrastructure()`
- `appsettings.json` / `appsettings.Development.json` — configuration (connection strings, JWT signing key)

**Depends on:** `Application` and `Infrastructure`. This is the only project allowed to know both exist, since it's responsible for wiring everything together at startup.

## Why this structure, in practice

- **Testability** — `Application`'s business logic can be tested with mocked interfaces, with no real database or web server involved.
- **Swappability** — infrastructure concerns (database, specific libraries) can change without touching business logic.
- **Enforced boundaries** — the separation is structural (project references), not just a naming convention that's easy to violate by accident.

## Note on scale

This is a heavier structure than a solo, MVP-stage project strictly requires — full project-per-layer is more typical of larger, longer-lived, multi-contributor systems. It was kept here deliberately for the architectural practice and portfolio value, but if it ever starts to feel like friction rather than useful structure, a reasonable simplification path (roughly in order of how much structure is given up) is:

1. Keep all four conceptual layers, but as folders within a single project instead of four separate assemblies (loses compiler-enforced boundaries, keeps the mental model).
2. Merge `Domain` into `Application`, leaving three layers: `Api`, `Core` (Domain + Application), `Infrastructure`.
3. Collapse to two layers: `Api` (entities + business logic + controllers) and `Infrastructure` (data access only).

None of these require a rewrite — they're refactors (moving files, merging namespaces, deleting `.csproj` files), not architectural changes to the underlying design.