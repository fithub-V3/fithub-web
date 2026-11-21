# fithub

A fitness app for building an exercise bank, putting exercises together into workouts and planning a training week.

This is a monorepo with four parts:

| Part | Path | Stack | Default URL |
|---|---|---|---|
| API | `services/api` | ASP.NET Core 9, EF Core, PostgreSQL | http://localhost:5111 |
| Web app | `apps/web` | Next.js 16, React 19, Sass, Tailwind 4 | http://localhost:3000 |
| Mobile app | `apps/mobile` | Expo 54 (React Native 0.81, expo-router) | Expo dev server on :8081 |
| ML service | `services/ml` | FastAPI, PyTorch, scikit-learn | http://localhost:8000 *(not built yet)* |

`packages/shared-types` is an empty placeholder workspace for now.

See [docs/FEATURES.md](docs/FEATURES.md) for what's built and [docs/fithub-todo.md](docs/fithub-todo.md) for known issues.

---

## Prerequisites

| Tool | Version | Used by |
|---|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download) | 9.0 | API |
| `dotnet-ef` CLI | 9.x | API database migrations |
| [PostgreSQL](https://www.postgresql.org/download/) | 14+ | API |
| [Node.js](https://nodejs.org/) + npm | 20+ (22 LTS recommended) | Web, Mobile |
| [Expo Go](https://expo.dev/go) on your phone, **or** an Android emulator / iOS simulator | Expo SDK 54 | Mobile |
| Python | 3.11+ | ML service |

Install the EF Core CLI once:

```bash
dotnet tool install --global dotnet-ef --version "9.*"
```

---

## Suggested order

1. **PostgreSQL**: create the database
2. **API**: apply migrations, then run it
3. **Web** and/or **Mobile**: run them against the API
4. **ML service**: optional, and not wired up yet

---

## 1. Database (PostgreSQL)

The API's development connection string is in `services/api/src/Fithub.Api/appsettings.Development.json`:

```
Host=localhost;Database=fithub_dev;Username=fithub;Password=devpassword
```

Create a matching role and database:

```bash
sudo -u postgres psql -c "CREATE ROLE fithub WITH LOGIN PASSWORD 'devpassword';"
sudo -u postgres psql -c "CREATE DATABASE fithub_dev OWNER fithub;"
```

<details>
<summary>Or run Postgres in Docker</summary>

```bash
docker run -d --name fithub-postgres \
  -e POSTGRES_USER=fithub \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=fithub_dev \
  -p 5432:5432 \
  postgres:16
```

</details>

If you want different credentials, don't edit the committed file. Override the connection string with user-secrets instead (see [Configuration](#configuration)).

---

## 2. API (`services/api`)

```bash
cd services/api/src

# Restore packages
dotnet restore

# Create/update the database schema
dotnet ef database update \
  --project Fithub.Infrastructure \
  --startup-project Fithub.Api

# Run the API (uses the "http" launch profile → http://0.0.0.0:5111)
dotnet run --project Fithub.Api
```

The API now listens on **http://localhost:5111**. It also binds `0.0.0.0`, so a phone on the same network can reach it.

- **OpenAPI document** (Development only): http://localhost:5111/openapi/v1.json
- **Sample requests**: `Fithub.Api/Fithub.Api.http` runs in VS Code (REST Client) or Rider.
- **Hot reload**: `dotnet watch --project Fithub.Api`

### Endpoints

| Area | Routes |
|---|---|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` (rate limited to 5 requests/min) |
| Exercises | `GET/POST/PUT/DELETE /exercises` |
| Workouts | `GET/POST/PUT/DELETE /workouts` |
| Schedules | `GET/POST/PUT/DELETE /schedules` |

Every route except auth needs an `Authorization: Bearer <accessToken>` header.

### Adding a migration

```bash
cd services/api/src
dotnet ef migrations add <MigrationName> \
  --project Fithub.Infrastructure \
  --startup-project Fithub.Api \
  --output-dir Persistence/Migrations
```

---

## 3. Web app (`apps/web`)

The web app is an npm workspace, so install from the **repo root**:

```bash
# from the repo root
npm install

# start the Next.js dev server
npm run dev --workspace=apps/web
# (or: cd apps/web && npm run dev)
```

Open **http://localhost:3000**.

- The API URL is hardcoded as `http://localhost:5111` in `apps/web/lib/auth-client.ts`.
- The API's CORS policy only allows `http://localhost:3000`. If you run the web app on a different port, update `AllowFrontend` in `services/api/src/Fithub.Api/Program.cs`.

Other scripts: `build`, `start` (serves the production build) and `lint`.

---

## 4. Mobile app (`apps/mobile`)

The mobile app is **not** in the root npm workspace. It has its own lockfile, so install it on its own:

```bash
cd apps/mobile
npm install
```

### Point it at your API

A phone or emulator can't reach your computer through `localhost`. Edit `API_BASE_URL` in `apps/mobile/src/lib/api-client.ts` to use an address that works for your setup:

| Running on | Use |
|---|---|
| Physical phone (Expo Go) on the same Wi-Fi | `http://<your-computer-LAN-IP>:5111`. Find the IP with `hostname -I` (Linux), `ipconfig getifaddr en0` (macOS) or `ipconfig` (Windows) |
| Android emulator | `http://10.0.2.2:5111` |
| iOS simulator | `http://localhost:5111` |

Please don't commit your personal LAN IP.

Make sure the API is running and your firewall allows inbound connections on port **5111**.

### Run it

```bash
npx expo start        # then scan the QR code with Expo Go, or press a / i
npm run android       # open on an Android emulator/device
npm run ios           # open on the iOS simulator (macOS only)
```

> `npm run web` starts the Expo web build on :8081. The API's CORS policy only allows `:3000`, so API calls from the Expo web build will fail unless you add that origin.

---

## 5. ML service (`services/ml`)

> **Status:** scaffold only. `app/main.py`, `app/model.py` and the training scripts are still empty, and no other part calls this service yet.

Set up the environment:

```bash
cd services/ml
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# torch is pinned to a CPU build, which lives on PyTorch's own package index
pip install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu
```

Once `app/main.py` defines a FastAPI `app`, run it with:

```bash
uvicorn app.main:app --reload --port 8000
```

Trained model files (`models/*.pt`, `models/*.joblib`) are git-ignored.

---

## Running everything together

Use a separate terminal for each part:

```bash
# Terminal 1: API
cd services/api/src && dotnet run --project Fithub.Api

# Terminal 2: Web
npm run dev --workspace=apps/web

# Terminal 3: Mobile
cd apps/mobile && npx expo start
```

Then open http://localhost:3000, register an account and start adding exercises.

---

## Configuration

The API reads configuration from the standard ASP.NET Core sources: `appsettings*.json`, then user-secrets, then environment variables.

| Key | Purpose | Dev default |
|---|---|---|
| `ConnectionStrings:Default` | Postgres connection string | see above |
| `Jwt:SigningKey` | HMAC key for signing access tokens (at least 32 bytes) | placeholder in `appsettings.Development.json` |
| `Jwt:Issuer` / `Jwt:Audience` | JWT issuer and audience | `Fithub` |

Override them locally without touching committed files:

```bash
cd services/api/src/Fithub.Api
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Database=fithub_dev;Username=me;Password=secret"
dotnet user-secrets set "Jwt:SigningKey" "$(openssl rand -base64 64)"
```

You can also use environment variables. Use `__` as the separator, for example `ConnectionStrings__Default=...`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `password authentication failed for user "fithub"` | The Postgres role or password doesn't match the connection string. Recreate the role (step 1) or override the connection string. |
| `relation "..." does not exist` | Migrations haven't been applied. Run `dotnet ef database update` (step 2). |
| `dotnet ef` not found | Run `dotnet tool install --global dotnet-ef --version "9.*"` and make sure `~/.dotnet/tools` is on your `PATH`. |
| Web shows a CORS error | The web app must run on `http://localhost:3000`, or you need to add its origin to `AllowFrontend`. |
| Mobile shows "Network request failed" | Check `API_BASE_URL` (step 4), that the phone is on the same network and that port 5111 isn't blocked by a firewall. |
| `429 Too Many Requests` on login | The auth endpoints allow 5 requests/min. Wait a minute. |
